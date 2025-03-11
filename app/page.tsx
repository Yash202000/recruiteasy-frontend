'use client';

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { encodePassphrase, generateRoomId, randomString } from '@/lib/client-utils';
import styles from '../styles/Home.module.css';

const BACKEND_URI = process.env.BACKEND_URI !== undefined ? process.env.BACKEND_URI : "http://localhost:8000";


function Tabs(props: React.PropsWithChildren<{}>) {
  const searchParams = useSearchParams();
  const tempSearchParams = searchParams?.get('tab');

  let tabIndex = 0;
  if (tempSearchParams === 'Custom') {
    tabIndex = 1;
  } else if (tempSearchParams === 'Interview') {
    tabIndex = 3;
  } else if (tempSearchParams === 'Profile') {
    tabIndex = 2;
  } else if (tempSearchParams === 'Home') {
    tabIndex = 0;
  }

  const router = useRouter();

  function onTabSelected(index: number) {
    let tab = '';
    if (index === 1) {
      tab = 'Custom';
    } else if (index === 3) {
      tab = 'Interview';
    } else if (index === 2) {
      tab = 'Profile';
    } else if (index===0){
      tab = 'Home'
    }

    router.push(`/?tab=${tab}`);
  }

  let tabs = React.Children.map(props.children, (child, index) => {
    return (
      <button
        className="lk-button"
        onClick={() => {
          if (onTabSelected) {
            onTabSelected(index);
          }
        }}
        aria-pressed={tabIndex === index}
      >
        {/* @ts-ignore */}
        {child?.props.label}
      </button>
    );
  });

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabSelect}>{tabs}</div>
      {/* @ts-ignore */}
      {props.children[tabIndex]}
    </div>
  );
}

function DemoMeetingTab(props: { label: string }) {
  const router = useRouter();
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));
  
  const [recentRooms, setRecentRooms] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentRooms() {
      try {
        console.log("Inside page.tsx ",BACKEND_URI)

        console.log(`${BACKEND_URI}/calls/?user_id=1`)
        const response = await axios.get(`${BACKEND_URI}/calls/?user_id=1`, {
          headers: { accept: "application/json" },
        });
        setRecentRooms(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch rooms.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecentRooms();
  }, []);

  const handleCardClick = (roomId: string) => {
    router.push(`/interview-feedback/${roomId}`);
  };



  const startMeeting = () => {
    if (e2ee) {
      router.push(`/rooms/${generateRoomId()}#${encodePassphrase(sharedPassphrase)}`);
    } else {
      router.push(`/rooms/${generateRoomId()}`);
    }
  };

  const cards = [
    {
      title: "Finance Interviews",
      description: "18 practice sessions",
      buttonText: "Browse interviews",
    },
    {
      title: "Software Interviews",
      description: "14 practice sessions",
      buttonText: "Browse interviews",
    },
  ];

  return (
    <div className={styles.tabContent}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
        <h3>Interview Practice</h3>
        <p>Ace your next interview with live practice and feedback.</p>
        <button className="lk-button" onClick={ ()=>router.push(`/interviews`)}>Browse 100+ interviews</button>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: "1.5rem" }}>
          {cards.map((card, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                width: "250px",
                textAlign: "center",
              }}
            >
              <h4>{card.title}</h4>
              <p>{card.description}</p>
              <button className="lk-button">{card.buttonText}</button>
            </div>
          ))}
        </div>
      </div>

      <button style={{ marginTop: "1rem" }} className="lk-button" onClick={startMeeting}>
        Start General Interview
      </button>
      
      {/* <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <input
            id="use-e2ee"
            type="checkbox"
            checked={e2ee}
            onChange={(ev) => setE2ee(ev.target.checked)}
          />
          <label htmlFor="use-e2ee">Enable end-to-end encryption</label>
        </div>
        {e2ee && (
          <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            <label htmlFor="passphrase">Passphrase</label>
            <input
              id="passphrase"
              type="password"
              value={sharedPassphrase}
              onChange={(ev) => setSharedPassphrase(ev.target.value)}
            />
          </div>
        )}
      </div> */}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
        <h3>Recent Interviews Taken</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
            {recentRooms.map((room: any, index: number) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  width: "250px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                
              >
                <h4>Room ID: {room.room.name}</h4>
                <p>Status: {room.room.is_group ? "Pending" : "Submitted"}</p>
                <button className="lk-button" onClick={() => handleCardClick(room.room.id)}>Check Report</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button className="lk-button" onClick={() => router.push(`/new-interview`)}>
          Start a New Interview
        </button>
      </div>
    </div>
  );
}

function CustomConnectionTab(props: { label: string }) {
  const router = useRouter();

  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const serverUrl = formData.get('serverUrl');
    const token = formData.get('token');
    if (e2ee) {
      router.push(
        `/custom/?liveKitUrl=${serverUrl}&token=${token}#${encodePassphrase(sharedPassphrase)}`,
      );
    } else {
      router.push(`/custom/?liveKitUrl=${serverUrl}&token=${token}`);
    }
  };
  return (
    <form className={styles.tabContent} onSubmit={onSubmit}>
      <p style={{ marginTop: 0 }}>
        Connect RecruitEasy Meet with a custom server using RecruitEasy Cloud or RecruitEasy Server.
      </p>
      <input
        id="serverUrl"
        name="serverUrl"
        type="url"
        placeholder="RecruitEasy Server URL: wss://*.recruiteasy.com"
        required
      />
      <textarea
        id="token"
        name="token"
        placeholder="Token"
        required
        rows={5}
        style={{ padding: '1px 2px', fontSize: 'inherit', lineHeight: 'inherit' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          <input
            id="use-e2ee"
            type="checkbox"
            checked={e2ee}
            onChange={(ev) => setE2ee(ev.target.checked)}
          ></input>
          <label htmlFor="use-e2ee">Enable end-to-end encryption</label>
        </div>
        {e2ee && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <label htmlFor="passphrase">Passphrase</label>
            <input
              id="passphrase"
              type="password"
              value={sharedPassphrase}
              onChange={(ev) => setSharedPassphrase(ev.target.value)}
            />
          </div>
        )}
      </div>

      <hr
        style={{ width: '100%', borderColor: 'rgba(255, 255, 255, 0.15)', marginBlock: '1rem' }}
      />
      <button
        style={{ paddingInline: '1.25rem', width: '100%' }}
        className="lk-button"
        type="submit"
      >
        Connect
      </button>
    </form>
  );
}


function ProfileTab(props: { label: string }){
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profileId = 1; // Replace with dynamic ID if needed

  useEffect(() => {
    // Fetch profile details
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND_URI}/profiles/${profileId}`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile details.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profileId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({
      ...prev,
      [key]: { ...prev[key], [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`${BACKEND_URI}/profiles/${profileId}`, profile);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  if (loading) return <p className="text-center mt-4 text-gray-500">Loading profile...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
      <form onSubmit={handleSubmit} className={styles.tabContent}>
        {/* General Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={profile.bio || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={profile.date_of_birth || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contact_number"
              value={profile.contact_number || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={profile.address || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Resume URL</label>
          <input
            type="url"
            name="resume_url"
            value={profile.resume_url || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Social Profiles */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Profiles</legend>
          {['linkedin', 'github', 'portfolio'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type="url"
                name={field}
                value={profile.profiles?.[field] || ''}
                onChange={(e) => handleNestedChange(e, 'profiles')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          ))}
        </fieldset>

        {/* Education */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Education</legend>
          {profile.education?.map((edu: any, index: number) => (
            <div key={index} className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution</label>
                <input
                  type="text"
                  name={`education[${index}].institution`}
                  value={edu.institution}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree</label>
                <input
                  type="text"
                  name={`education[${index}].degree`}
                  value={edu.degree}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  name={`education[${index}].year`}
                  value={edu.year}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          ))}
        </fieldset>

        {/* Work Experience */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Work Experience</legend>
          {profile.work_experience?.map((work: any, index: number) => (
            <div key={index} className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  name={`work_experience[${index}].company`}
                  value={work.company}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name={`work_experience[${index}].role`}
                  value={work.role}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  name={`work_experience[${index}].duration`}
                  value={work.duration}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          ))}
        </fieldset>

        {/* Projects */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Projects</legend>
          {profile.projects?.map((project: any, index: number) => (
            <div key={index} className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleNestedChange(e, 'projects')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name='description'
                  value={project.description}
                  onChange={(e) => handleNestedChange(e, 'projects')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={project.url}
                  onChange={(e) => handleNestedChange(e, 'projects')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          ))}
        </fieldset>


        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <textarea
            name="skills"
            value={profile.skills?.join(', ') || ''}
            onChange={(e) => {
              setProfile((prev: any) => ({
                ...prev,
                skills: e.target.value.split(',').map((skill) => skill.trim()),
              }));
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring"
        >
          Update Profile
        </button>
      </form>
  );
};


function HomeTab(props: { label: string }) {
  const router = useRouter();

  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState("");

  const cards = [
    {
      title: "Practice Interviews",
      description: "Prepare for your next job with 150+ live interviews ready to take.",
      buttonLabel: "Start Now",
      onClick: () => router.push("?tab=Custom"),
    },
    {
      title: "Resume Improvement",
      description: "Enhance your resume with professional insights and tips.",
      buttonLabel: "Improve Resume",
      onClick: () => router.push("/resume-improvement"),
    },
    {
      title: "Profile Improvement",
      description: "Optimize your profile for better visibility to recruiters.",
      buttonLabel: "Improve Profile",
      onClick: () => router.push("?tab=Interview"),
    },
  ];

  const dummyJob = {
    title: "Software Engineer - Backend",
    description: "Join a leading tech company to build scalable backend systems.",
    company: "TechCorp Inc.",
    location: "Remote",
    buttonLabel: "View Details",
    onClick: () => router.push("/jobs/software-engineer-backend"),
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Welcome back</h1>
      <br />
      <h3>Important Tasks</h3>
      <br />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h4>{card.title}</h4>
            <p>{card.description}</p>
            <button
              className="lk-button"
              onClick={card.onClick}
            >
              {card.buttonLabel}
            </button>
          </div>
        ))}
      </div>

      <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #ddd" }} />

      <h3>My jobs</h3>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginTop: "1rem",
        }}
      >
        <h4>{dummyJob.title}</h4>
        <p>
          <strong>Company:</strong> {dummyJob.company}
        </p>
        <p>
          <strong>Location:</strong> {dummyJob.location}
        </p>
        <p>{dummyJob.description}</p>
        <button
          className="lk-button"
          onClick={dummyJob.onClick}
        >
          {dummyJob.buttonLabel}
        </button>
      </div>
    </div>
  );
}


export default function Page() {
  return (
    <>
      <main className={styles.main} data-lk-theme="default">
        <Suspense fallback="Loading">
          <Tabs>
            <HomeTab label="Home" />
            <DemoMeetingTab label="Interviews" />
            <CustomConnectionTab label="Custom" />
            <ProfileTab label="Profile" />
          </Tabs>
        </Suspense>
      </main>
      {/* <footer data-lk-theme="default">
        Hosted on{' '}
        <a href="https://livekit.io/cloud?ref=meet" rel="noopener">
          Yash's Localhost
        </a>
        . Source code on{' '}
        <a href="https://github.com/yash202000/meet?ref=meet" rel="noopener">
          GitHub
        </a>
        .
      </footer> */}
    </>
  );
}

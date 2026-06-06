import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { useNavigate } from 'react-router-dom'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8f4ee] pb-10">
            <Navbar />
            <div className="max-w-3xl mx-auto mt-8">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-[#e5d3c2] p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div className="flex items-center gap-8">
                        <Avatar className="h-28 w-28 shadow-lg border-4 border-[#f5e9da] bg-[#f8f4ee]">
                            <AvatarImage src={user?.profile?.profilePhoto || "/default-user.png"} alt="profile" />
                            <AvatarFallback>
                                <img src="/default-user.png" alt="user" className="h-full w-full object-cover rounded-full" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-extrabold text-3xl text-[#8B5C2A] tracking-tight">{user?.fullname}</h1>
                            <p className="text-gray-500 mt-2 text-base italic max-w-xs">{user?.profile?.bio || 'No bio added yet.'}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="rounded-full border-2 border-[#8B5C2A] text-[#8B5C2A] hover:bg-[#F5E9DA] hover:border-[#8B5C2A] shadow transition px-6 py-2 text-base font-semibold" variant="outline"><Pen className="w-5 h-5" /></Button>
                </div>
                {/* Contact & Skills */}
                <div className="bg-white rounded-2xl shadow border border-[#e5d3c2] mt-8 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-lg font-bold text-[#8B5C2A] mb-4">Contact</h2>
                        <div className="flex items-center gap-3 mb-4 text-gray-700 bg-[#f8f4ee] rounded-lg px-4 py-2"><Mail className="w-5 h-5 text-[#8B5C2A]" /><span className="font-medium">{user?.email}</span></div>
                        <div className="flex items-center gap-3 text-gray-700 bg-[#f8f4ee] rounded-lg px-4 py-2"><Contact className="w-5 h-5 text-[#8B5C2A]" /><span className="font-medium">{user?.phoneNumber}</span></div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#8B5C2A] mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {user?.profile?.skills && user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => (
                                <Badge key={index} className="bg-[#F5E9DA] text-[#8B5C2A] border border-[#e5d3c2] rounded-full px-4 py-1 text-sm font-semibold shadow-sm">{item}</Badge>
                            )) : <span className="text-gray-400">NA</span>}
                        </div>
                        <div className="mt-6">
                            <Label className="text-md font-bold text-[#8B5C2A]">Resume</Label><br />
                            {isResume && user?.profile?.resume ? <a target="_blank" rel="noopener noreferrer" href={user?.profile?.resume} className="text-[#8B5C2A] hover:underline cursor-pointer font-medium">{user?.profile?.resumeOriginalName}</a> : <span className="text-gray-400">NA</span>}
                        </div>
                    </div>
                </div>
                {/* Applied Jobs - Only for students */}
                {user?.role === 'student' && (
                  <div className="bg-white rounded-2xl shadow border border-[#e5d3c2] mt-8">
                      <div className="px-8 pt-8 pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <h2 className="font-bold text-xl text-[#8B5C2A]">Applied Jobs</h2>
                          <Button
                              onClick={() => navigate('/interview-plan')}
                              className="bg-[#8B5C2A] hover:bg-[#704214] text-white rounded-full"
                          >
                              Customize Interview Plan
                          </Button>
                      </div>
                      <div className="p-8 pt-2">
                          <AppliedJobTable />
                      </div>
                  </div>
                )}
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile
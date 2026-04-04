import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    // Format salary to LPA (Lakhs Per Annum)
    const formatSalaryLPA = (salary) => {
        if (!salary) return '';
        return `${Math.round(Number(salary) / 100000)} LPA`;
    };
    return (
        <div
            onClick={()=> navigate(`/description/${job._id}`)}
            className='p-5 rounded-xl shadow-lg bg-gradient-to-br from-[#f9f5ee] via-[#f7ecd7] to-[#f3e3c3] border border-[#c8b07e] hover:shadow-2xl hover:scale-[1.025] transition-all duration-200 cursor-pointer'
        >
        <div>
            <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
            <p className='text-sm text-gray-500'>India</p>
        </div>
        <div>
            <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
            <p className='text-sm text-gray-600'>{job?.description}</p>
        </div>
        <div className='flex items-center gap-2 mt-4'>
            <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
            <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
            <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{formatSalaryLPA(job?.salary)}</Badge>
        </div>

    </div>
    )
}

export default LatestJobCards
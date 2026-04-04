import { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        const salaryRanges = {
            '0–5 Lakh': [0, 500000],
            '5–10 Lakh': [500000, 1000000],
            '10–20 Lakh': [1000000, 2000000],
            '20+ Lakh': [2000000, Infinity],
        };

        let filtered = allJobs;
        if (searchedQuery && typeof searchedQuery === 'object') {
            filtered = allJobs.filter((job) => {
                let match = true;
                if (searchedQuery.location) {
                    match = match && job.location && job.location.toLowerCase() === searchedQuery.location.toLowerCase();
                }
                if (searchedQuery.industry) {
                    // Match in title or description
                    const industry = searchedQuery.industry.toLowerCase();
                    match = match && (
                        (job.title && job.title.toLowerCase().includes(industry)) ||
                        (job.description && job.description.toLowerCase().includes(industry))
                    );
                }
                if (searchedQuery.salary && salaryRanges[searchedQuery.salary]) {
                    const [min, max] = salaryRanges[searchedQuery.salary];
                    match = match && Number(job.salary) >= min && Number(job.salary) < max;
                }
                if (searchedQuery.company) {
                    match = match && job.company && job.company.name && job.company.name.toLowerCase() === searchedQuery.company.toLowerCase();
                }
                return match;
            });
        }
        setFilterJobs(filtered);
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5 items-start' style={{height: '88vh', minHeight: '400px'}}>
                    {/* Sticky filter section, only as tall as jobs area */}
                    <div className='w-1/5'>
                        <div style={{maxHeight: '88vh', overflowY: 'auto', paddingRight: '0.5rem'}}>
                            <FilterCard />
                        </div>
                    </div>
                    <div className='flex-1 h-full flex flex-col'>
                        <div className='h-full bg-white/80 rounded-xl shadow-md flex flex-col'>
                            <div className='flex-1 overflow-y-auto overflow-x-hidden pb-5'>
                                {filterJobs.length <= 0 ? (
                                    <div className="flex items-center justify-center h-full w-full">
                                        <span className="text-2xl font-semibold text-gray-400">No jobs found</span>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-3 gap-4 min-h-full content-start'>
                                        {filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs
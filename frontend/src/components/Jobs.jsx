import React from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import Footer from './shared/Footer'

const Jobs = () => {
    const { allJobs } = useSelector(store => store.job)

    return (
        <>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    {/* Removed FilterCard */}
                    <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                        {allJobs.length === 0 ? (
                            <span>Job not found</span>
                        ) : (
                            <div className='grid grid-cols-3 gap-4'>
                                {allJobs.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                        key={job?._id}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Jobs

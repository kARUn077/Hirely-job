import { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const fitlerData = [
    {
        fitlerType: "Location",
        array: [
            "Bengaluru",
            "Hyderabad",
            "Delhi NCR",
            "Mumbai",
            "Pune",
            "Chennai",
            "Gurgaon",
            "Noida",
            "Kolkata",
            "Ahmedabad"
        ]
    },
    {
        fitlerType: "Industry",
        array: [
            "Software Engineer",
            "Data Scientist",
            "Product Manager",
            "Cloud Engineer",
            "UI/UX Designer",
            "DevOps Engineer",
            "QA Engineer"
        ]
    },
    {
        fitlerType: "Salary",
        array: [
            "0–5 Lakh",
            "5–10 Lakh",
            "10–20 Lakh",
            "20+ Lakh"
        ]
    },
]

const FilterCard = () => {
    const [location, setLocation] = useState('');
    const [industry, setIndustry] = useState('');
    const [salary, setSalary] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchedQuery({ location, industry, salary }));
    }, [location, industry, salary, dispatch]);

    return (
        <div className="w-full p-5 rounded-xl shadow-md border border-[#e0cfa2] bg-white/80 font-harrypotter relative overflow-hidden">
            <h1 className='font-bold text-2xl text-[#b48a3c] tracking-wider mb-2 drop-shadow-lg' style={{fontFamily: 'Cinzel, serif'}}>Filter Jobs</h1>
            <hr className='mb-4 border-[#e0cfa2]' />
            {/* Location Filter */}
            <h1 className='font-bold text-lg text-[#b48a3c] mt-4 mb-2' style={{fontFamily: 'Cinzel, serif'}}>: LOCATION</h1>
            <RadioGroup value={location} onValueChange={setLocation}>
                {fitlerData[0].array.map((item, idx) => {
                    const itemId = `loc-${idx}`;
                    return (
                        <div className='flex items-center space-x-2 my-2' key={itemId}>
                            <RadioGroupItem value={item} id={itemId} className="border-[#b48a3c] focus:ring-[#7c4700]" />
                            <Label htmlFor={itemId} className="font-harrypotter text-[#4b2e05] text-base hover:text-[#b48a3c] cursor-pointer transition-all duration-200">{item}</Label>
                        </div>
                    )
                })}
            </RadioGroup>
            {/* Industry Filter */}
            <h1 className='font-bold text-lg text-[#b48a3c] mt-4 mb-2' style={{fontFamily: 'Cinzel, serif'}}>: INDUSTRY</h1>
            <RadioGroup value={industry} onValueChange={setIndustry}>
                {fitlerData[1].array.map((item, idx) => {
                    const itemId = `ind-${idx}`;
                    return (
                        <div className='flex items-center space-x-2 my-2' key={itemId}>
                            <RadioGroupItem value={item} id={itemId} className="border-[#b48a3c] focus:ring-[#7c4700]" />
                            <Label htmlFor={itemId} className="font-harrypotter text-[#4b2e05] text-base hover:text-[#b48a3c] cursor-pointer transition-all duration-200">{item}</Label>
                        </div>
                    )
                })}
            </RadioGroup>
            {/* Salary Filter */}
            <h1 className='font-bold text-lg text-[#b48a3c] mt-4 mb-2' style={{fontFamily: 'Cinzel, serif'}}>: SALARY</h1>
            <RadioGroup value={salary} onValueChange={setSalary}>
                {fitlerData[2].array.map((item, idx) => {
                    const itemId = `sal-${idx}`;
                    return (
                        <div className='flex items-center space-x-2 my-2' key={itemId}>
                            <RadioGroupItem value={item} id={itemId} className="border-[#b48a3c] focus:ring-[#7c4700]" />
                            <Label htmlFor={itemId} className="font-harrypotter text-[#4b2e05] text-base hover:text-[#b48a3c] cursor-pointer transition-all duration-200">{item}</Label>
                        </div>
                    )
                })}
            </RadioGroup>
        </div>
    )
}

export default FilterCard
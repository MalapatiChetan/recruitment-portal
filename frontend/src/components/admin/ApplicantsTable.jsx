import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const shortlistingStatus = [
    "Applied",
    "Shortlisted",
    "Interviewing",
    "Offered",
    "Accepted",
    "Rejected",
];

const ApplicantsTable = () => {
    const { applicants } = useSelector((store) => store.application);
    const dispatch = useDispatch();


    const statusHandler = async (status, appId) => {
        try {
            axios.defaults.withCredentials = true;

            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${appId}/update`, {
                status,
            });

            if (res.data.success) {
                toast.success(res.data.message);

                // ⬇️ Update the Redux state manually so UI reflects the change
                const updatedApplicants = {
                    ...applicants,
                    applications: applicants.applications.map(app =>
                        app._id === appId ? { ...app, status } : app
                    )
                };

                dispatch(setAllApplicants(updatedApplicants));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Status update failed');
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants &&
                        applicants?.applications?.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {item.applicant?.profile?.resume ? (
                                        <a
                                            className="text-blue-600"
                                            href={item.applicant.profile.resume}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {item.applicant.profile.resumeOriginalName}
                                        </a>
                                    ) : (
                                        "NA"
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item?.applicant?.createdAt?.split("T")[0]}
                                </TableCell>
                                <TableCell>
                                    <select
                                        className="bg-gray-100 px-2 py-1 rounded border text-sm"
                                        value={item.status || "applied"}
                                        onChange={(e) => statusHandler(e.target.value, item._id)}
                                    >
                                        {shortlistingStatus.map((statusOption) => (
                                            <option
                                                key={statusOption}
                                                value={statusOption.toLowerCase()}
                                            >
                                                {statusOption}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                                {/* <TableCell className="float-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      {shortlistingStatus.map((status, index) => (
                        <div
                          onClick={() =>
                            statusHandler(status.toLowerCase(), item?._id)
                          }
                          key={index}
                          className="flex w-fit items-center my-2 cursor-pointer"
                        >
                          <span>{status}</span>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell> */}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
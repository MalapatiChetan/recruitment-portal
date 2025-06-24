import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

const steps = [
    { key: "applied", label: "Applied" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "interviewing", label: "Interviewing" },
    { key: "offered", label: "Offered" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
];

const ApplicationStatus = () => {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${id}`);
                if (typeof res.data !== "object" || !res.data.application) {
                    throw new Error("Unexpected response format. Are you hitting the backend API?");
                }
                setApplication(res.data.application);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, [id]);

    if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!application) return null;

    const currentStep = steps.findIndex((step) => step.key === application.status);
    const isRejected = application.status === "rejected";

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1">
                <div className="max-w-4xl mx-auto p-6 my-10">
                    <h1 className="text-3xl font-semibold text-center mb-8">Application Progress</h1>
                    <div className="flex flex-col items-center gap-8">
                        <div className="w-full flex justify-between items-center relative">
                            {steps.map((step, index) => {
                                const isCurrent = index === currentStep;

                                // Only allow green up to interviewing if rejected
                                const allowedGreen = ["applied", "shortlisted", "interviewing"];
                                const isCompleted = isRejected
                                    ? index < currentStep && allowedGreen.includes(step.key)
                                    : index < currentStep;

                                const isRejectedStep = isRejected && isCurrent;

                                return (
                                    <div key={step.key} className="flex-1 flex flex-col items-center relative">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                        ${isRejectedStep
                                                    ? "bg-red-500 text-white"
                                                    : isCompleted || isCurrent
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-300 text-gray-700"}`}
                                        >
                                            {index + 1}
                                        </div>

                                        <div
                                            className={`text-sm mt-2 text-center
                        ${isRejectedStep
                                                    ? "text-red-500 font-semibold"
                                                    : isCompleted || isCurrent
                                                        ? "text-green-600 font-medium"
                                                        : "text-gray-500"}`}
                                        >
                                            {step.label}
                                        </div>

                                        {index < steps.length - 1 && (
                                            <div
                                                className={`absolute top-5 left-1/2 transform -translate-x-1/2 w-full h-1 z-[-1]
                          ${isRejectedStep
                                                        ? "bg-red-300"
                                                        : isCompleted
                                                            ? "bg-green-500"
                                                            : "bg-gray-300"}`}
                                            ></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-center mt-10">
                            <p className="text-lg">
                                <span className="font-semibold">Current Status:</span>{" "}
                                <span
                                    className={`font-bold uppercase
                    ${application.status === "rejected"
                                            ? "text-red-600"
                                            : application.status === "accepted"
                                                ? "text-green-600"
                                                : "text-yellow-600"}`}
                                >
                                    {application.status}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Updated on: {new Date(application.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ApplicationStatus;
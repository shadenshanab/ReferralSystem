import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ReferralTree from '@/Components/ReferralTree';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Dashboard({ auth }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
    };

    // Generate referral link based on the username
    const referralLink = `${window.location.origin}/register?ref=${auth.user.username}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <label className="font-bold text-gray-700">Referral Link:</label>
                            <div className="text-gray-500">
                                <a href={referralLink}>{referralLink}</a>
                                <button
                                    className="ml-2 bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>

                        </div>
                        {/* Display user's level and referral points */}
                        <div className="p-6 text-gray-900">
                            <div className="font-bold text-gray-700">Level:</div>
                            <div className="text-gray-500">{auth.user.level}</div>
                            <img className='w-80' src={auth.user.level_badge} alt="Level Badge" />
                        </div>
                        <div className="p-6 text-gray-900">
                            <div className="font-bold text-gray-700">Referral Points:</div>
                            <div className="text-gray-500">{auth.user.referral_points}</div>
                        </div>
                        {/* <ReferralTree className="ml-20" userData={auth.user} /> */}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Plot from 'react-plotly.js';

const MetricsChart = ({ totalUsers, totalPointsAwarded, levelDistribution }) => {
    // Extract level names and counts from levelDistribution data
    const levels = levelDistribution.map(data => data.level);
    const counts = levelDistribution.map(data => data.count);

    // Define data for the charts
    const usersChart = [
        {
            type: 'indicator',
            mode: 'number+gauge',
            value: totalUsers,
            title: {
                text: 'Total Users',
                font: {
                    size: 18,
                },
            },

        },
    ];

    const pointsChart = [
        {
            type: 'indicator',
            mode: 'number+gauge',
            value: totalPointsAwarded,
            title: {
                text: 'Total Points Awarded',
                font: {
                    size: 18,
                },
            },
        },
    ];

    const distributionChart = [
        {
            type: 'pie',
            labels: levels,
            values: counts,
            title: {
                text: 'Level Distribution',
                font: {
                    size: 18,
                },
            },
        },
    ];

    return (
        <div class="mt-12">
            <div class="flex">
                <div class="mx-2 w-1/3">
                    <Plot data={usersChart} layout={{
                        width: 300,
                        height: 300,
                        margin: { t: 20, b: 20, r: 40, l: 40 },
                        paper_bgcolor: 'rgba(245, 245, 245, 1)',
                        displaylogo: false,
                    }} />
                </div>
                <div class="mx-2 w-1/3">
                    <Plot data={pointsChart} layout={{
                        width: 300,
                        height: 300,
                        margin: { t: 20, b: 20, r: 40, l: 40, },
                        paper_bgcolor: 'rgba(245, 245, 245, 1)',
                        displaylogo: false,
                    }} />
                </div>
                <div class=" w-1/3 ">
                    <Plot data={distributionChart} layout={{
                        width: 400,
                        height: 400,
                        margin: { t: 20, b: 20, r: 40, l: 40 },
                        paper_bgcolor: 'rgba(245, 245, 245, 1)',
                    }
                    } />
                </div></div>

        </div>
    );
};

export default function AdminPage({ users, auth, totalUsers, totalPointsAwarded, levelDistribution, referredUsers }) {
    const [sortKey, setSortKey] = useState('name'); // Default sort key
    const [searchText, setSearchText] = useState('');

    const handleSort = (key) => {
        setSortKey(key);
    };

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) =>
        a[sortKey].localeCompare(b[sortKey])
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 class="font-semibold text-xl text-gray-800 leading-tight">Admin</h2>}
        >
            <Head title="AdminPage" />
            <div class="container mx-16 ">

                <h1 class="my-4 flex flex-row flex-wrap py-4 bold text-2xl">User Management</h1>
                <div class="relative mb-4 flex w-full flex-wrap items-stretch sm:w-1/3 md:w-1/4 px-2">
                    <input
                        type="text"
                        class="relative m-0 block w-[1px] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                        placeholder="Search by name"
                        aria-label="Search"
                        value={searchText}
                        onChange={handleSearch}
                    />
                </div>
                <div class="flex flex-col">
                    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div class="overflow-hidden">
                                <table class="min-w-full text-left text-sm font-light">
                                    <thead class="border-b border-neutral-300 font-medium dark:border-neutral-500">
                                        <tr class="border-b border-neutral-300">
                                            <th scope="col" class="px-6 py-4 hover:cursor-pointer" title='click to sort' onClick={() => handleSort('name')}>Name</th>
                                            <th scope="col" class="px-6 py-4 hover:cursor-pointer" title='click to sort' onClick={() => handleSort('email')}>Email</th>
                                            <th scope="col" class="px-6 py-4 hover:cursor-pointer" title='click to sort' onClick={() => handleSort('created_at')}>
                                                Registration Date</th>
                                            <th scope="col" class="px-6 py-4 ">
                                                Total Points Earned</th>
                                            <th scope="col" class="px-6 py-4 ">
                                                Number of Reffered Users</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedUsers.map((user) => (
                                            <tr class="border-b dark:border-neutral-500" key={user.id}>
                                                <td class="whitespace-nowrap px-6 py-4 font-medium">{user.name}</td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.email}</td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.created_at}</td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.referral_points}</td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.referred_users}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div>
                                    <MetricsChart
                                        totalUsers={totalUsers}
                                        totalPointsAwarded={totalPointsAwarded}
                                        levelDistribution={levelDistribution}
                                    />
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

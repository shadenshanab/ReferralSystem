import React, { useEffect, useState } from 'react';
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
        <div className="mt-12">
            <div className="flex">
            <div className="mx-2 w-1/3">
                <Plot data={usersChart} layout={{
                    width: 300,
                    height: 300,
                    margin: { t: 20, b: 20, r: 40, l: 40 }
                }} />
            </div>
            <div className="mx-2 w-1/3">
                <Plot data={pointsChart} layout={{
                    width: 300,
                    height: 300,
                    margin: { t: 20, b: 20, r: 40, l: 40 }
                }} />
            </div>            <div className="mx-auto w-1/3">
                <Plot data={distributionChart} layout={{
                    width: 400,
                    height: 400,
                    margin: { t: 20, b: 20, r: 40, l: 40 }
                }} />
            </div></div>

        </div>
    );
};

export default function AdminPage({ users, referredUsers, totalUsers, totalPointsAwarded, levelDistribution }) {
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
        <>
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
                                    <thead class="border-b font-medium dark:border-neutral-500">
                                        <tr>
                                            <th scope="col" class="px-6 py-4 hover:cursor-pointer" title='click to sort' onClick={() => handleSort('name')}>Name</th>
                                            <th scope="col" class="px-6 py-4 hover:cursor-pointer" title='click to sort' onClick={() => handleSort('email')}>Email</th>
                                            <th scope="col" class="px-6 py-4 hover:cursor-pointer" title='click to sort' onClick={() => handleSort('created_at')}>
                                                Registration Date</th>
                                            <th scope="col" class="px-6 py-4 ">
                                                Total Points Earned</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedUsers.map((user) => (
                                            <tr class="border-b dark:border-neutral-500" key={user.id}>
                                                <td class="whitespace-nowrap px-6 py-4 font-medium">{user.name}</td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.email}</td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.created_at}</td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.referral_points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <MetricsChart
                                totalUsers={totalUsers}
                                totalPointsAwarded={totalPointsAwarded}
                                levelDistribution={levelDistribution}
                            />
                        </div>
                    </div>
                    <a href="/dashboard" class=" relative btn btn-primary mx-auto mb-12 hover:text-lg">Go to Dashboard</a>

                </div>
            </div>
        </>
    );
}

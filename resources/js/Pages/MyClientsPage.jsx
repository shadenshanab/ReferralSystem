import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const TreeNode = ({ user, referrals }) => (
    <div className="ml-6 border-l-2 border-[#FF2D20] border-opacity-70 pl-2">
        <div className="font-bold py-4 text-lg capitalize whitespace-nowrap">{user.name} </div>
        <div className="italic text-medium whitespace-nowrap">Level: {user.level}</div>
        <div className="italic text-medium whitespace-nowrap">Total Points: {user.referral_points}</div>
        <ul className="ml-6">
            {referrals.map((referral, index) => (
                <li key={index}>
                    <TreeNode user={referral.user} referrals={referral.referrals} />
                </li>
            ))}
        </ul>
    </div>
);

const MyClientsPage = ({ referralTree, auth }) => {

    //   const renderReferralTree = (tree, level = 0) => (
    //     <ul>
    //       {tree.map(({ user, referrals }) => (
    //         <li key={user.id}>
    //           {user.name} - Level {level}
    //           <ul>{renderReferralTree(referrals, level + 1)}</ul>
    //         </li>
    //       ))}
    //     </ul>
    //   );

    //   return (
    //     <div>
    //       <h1>My Clients</h1>
    //       {renderReferralTree(referralTree)}
    //     </div>
    //   );
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Clients</h2>}
        >
            <Head title="My Clients" />

            <div className="px-4">
                <div className="space-y-4 py-8 ">
                    {referralTree.map((rootNode, index) => (
                        <TreeNode class='' key={index} user={rootNode.user} referrals={rootNode.referrals} />
                    ))}
                </div>
            </div></AuthenticatedLayout>
    )
};


export default MyClientsPage;

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReferralTreeController extends Controller
{
    public function getReferralTree($userId)
    {
        // Get the user and its referrals from the database (you need to define the 'referrals' relationship in the User model)
        $user = User::with('referrals')->findOrFail($userId);

        // Format the referral tree data as needed by react-d3-tree
        $treeData = $this->formatReferralTree($user);

        return response()->json($treeData);
    }

    private function formatReferralTree($user)
    {
        $node = [
            'name' => $user->name,
            'attributes' => [
                'total_points' => $user->total_points,
            ],
        ];

        if ($user->referrals->count() > 0) {
            $node['children'] = [];
            foreach ($user->referrals as $referral) {
                $node['children'][] = $this->formatReferralTree($referral);
            }
        }

        return $node;
    }
}


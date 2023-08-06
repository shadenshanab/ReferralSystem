<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        // Fetch user data for the user management table
        $users = User::select('id', 'name', 'email', 'created_at', 'referral_points')

            ->withCount('referrals')
            ->withSum('referrals', 'referral_points')
            ->orderBy('created_at', 'desc')
            ->get();

        $users->transform(function ($user) {
            $user->referred_users = $user->referrals_count;
            $user->total_points = $user->referral_points;
            return $user;
        });

        // Calculate system metrics
        $totalUsers = User::count();
        $totalPointsAwarded = User::sum('referral_points');
        $levelDistribution = User::select('level', \DB::raw('count(*) as count'))
            ->groupBy('level')
            ->get();


        return Inertia::render('AdminPage', [
            'users' => $users,
            'totalUsers' => $totalUsers,
            'totalPointsAwarded' => $totalPointsAwarded,
            'levelDistribution' => $levelDistribution,
        ]);
    }
}
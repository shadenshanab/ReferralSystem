<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function myClients()
    {
        $user = auth()->user();
        $referralTree = $user->buildReferralTree();

        return Inertia::render('MyClientsPage', ['referralTree' => $referralTree]);
    }
}



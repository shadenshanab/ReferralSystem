<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        if ($request->has('ref')) {
            Session::put('referrer', $request->query('ref'));
        }
    
        return Inertia::render('Auth/Register');
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'unique:users', 'alpha_dash', 'min:3', 'max:30'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['required', 'string', 'unique:users'],
            'birthdate' => ['nullable', 'date'],
            'user_image' => ['required', 'image', 'max:5000'], 
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = $this->validator($request->all());
        $validator->validate();
    
        $referrer = User::whereUsername(Session::pull('referrer'))->first();

        print_r("hello world!");
        print_r(Session::pull('referrer'));
        print_r(Session::pull('ref'));
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'username' => $request->username,
            'phone' => $request->phone,
            'birthdate' => $request->birthdate,
            'referrer_id' => $referrer ? $referrer->id : null,
            'referral_points' => 0,
            'level' => $referrer ? $referrer->getLevel() : 'Novice Referrer',
            'level_badge' => $referrer ? $referrer->getLevelBadge() : 'https://media.discordapp.net/attachments/841047219549634580/1137061719190024344/novice-referrer-high-resolution-logo-color-on-transparent-background.png?width=1062&height=662',
            'role' => $request->role,
        ]);

        if ($request->hasFile('user_image')) {
            $user->user_image = $request->file('user_image')->store('user_images', 'public');
            $user->save();
        }
    
        event(new Registered($user));


        // Update referral points for the referrer
        $referrer = User::find($user->referrer_id);
        if ($referrer) {
            $referrer->assignReferralPoints();
        }      

        Auth::login($user);
    
        return redirect(RouteServiceProvider::HOME);
    }
}
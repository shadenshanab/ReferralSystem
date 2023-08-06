<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'referrer_id',
        'name',
        'username',
        'email',
        'phone',
        'birthdate',
        'user_image',
        'password',
        'referral_points',
        'referralCount',
        'level',
        'level_badge',
        'role',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['referral_link'];

    /**
     * Get the user's referral link.
     *
     * @return string
     */
    public function getReferralLinkAttribute()
    {
        return $this->referral_link = route('register', ['ref' => $this->username]);
    }

    /**
     * A user has a referrer.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_id', 'id');
    }

    /**
     * A user has many referrals.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function referrals()
    {
        return $this->hasMany(User::class, 'referrer_id', 'id');
    }

    public function referredUsers()
    {
        return $this->hasMany(User::class, 'referrer_id');
    }


    public function getLevel(): string
    {
        if ($this->referral_points >= 101) {
            return 'Master Referrer';
        } elseif ($this->referral_points >= 51) {
            return 'Expert Referrer';
        } else {
            return 'Novice Referrer';
        }
    }

    public function getLevelBadge(): string
    {
        $badgeUrls = [
            'Novice Referrer' => 'https://media.discordapp.net/attachments/841047219549634580/1137061719190024344/novice-referrer-high-resolution-logo-color-on-transparent-background.png?width=1062&height=662',
            'Expert Referrer' => 'https://media.discordapp.net/attachments/841047219549634580/1137061718883827712/expert-referrer-high-resolution-logo-color-on-transparent-background.png?width=1062&height=662',
            'Master Referrer' => 'https://media.discordapp.net/attachments/841047219549634580/1137061718615412847/master-referrer-high-resolution-logo-color-on-transparent-background.png?width=1062&height=662',
        ];

        $level = $this->getLevel();

        return $badgeUrls[$level] ?? ''; // Return the URL for the user's level, or an empty string if level is not found
    }

    public function assignReferralPoints()
    {
        $referralCount = $this->referrals()->count(); // Assuming you have defined the 'referrals' relationship

        if ($referralCount >= 1 && $referralCount <= 5) {
            $this->referral_points += 5;
        } elseif ($referralCount >= 6 && $referralCount <= 10) {
            $this->referral_points += 7;
        } elseif ($referralCount > 10) {
            $this->referral_points += 10;
        }

        $this->save();
        $this->updateLevel();

    }

    public function updateLevel()
    {
        $newLevel = $this->getLevel();
        if ($this->level !== $newLevel) {
            $this->level = $newLevel;
            $this->save();
        }
    }

}
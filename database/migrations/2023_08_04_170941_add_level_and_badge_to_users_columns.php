<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLevelAndBadgeToUsersColumns extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('level')->default(1);
            $table->string('level_badge')->nullable();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['level', 'level_badge']);
        });
    }
}

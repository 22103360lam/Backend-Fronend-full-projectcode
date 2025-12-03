<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;

class CheckTokenExpiry
{
    public function handle($request, Closure $next)
    {
        $token = $request->user()?->currentAccessToken();

        // If token expired → delete + return 401 unauthorized
        if ($token && $token->expires_at && Carbon::parse($token->expires_at)->isPast()) {
            $token->delete();
            return response()->json(['message' => 'Session Expired. Please login again.'], 401);
        }

        return $next($request);
    }
}

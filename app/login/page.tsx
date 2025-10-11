'use client'
import { useState } from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {supabase} from "@lib/superbase";
import { BadgeInfo } from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const allowedEmail = process.env.NEXT_PUBLIC_MY_EMAIL;

    if (email !== allowedEmail) {
      alert("허용되지 않은 사용자입니다.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email,  options: {
        emailRedirectTo: `${window.location.origin}/blog`,
      }, });

    if (error) {
      alert("로그인 실패: " + error.message);
    } else {
      alert("이메일로 로그인 링크를 보냈습니다!");
    }
  };

  return (
    <div className="w-full mx-auto max-w-xl p-6">
      <Card className="text-center p-6">
        <CardHeader>
          <CardTitle>LOGIN</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 items-center mb-1">
            <BadgeInfo className="w-4 h-4 text-emerald-400"/>
            <span className="text-xs font-bold text-emerald-400">인증된 사용자만 가능합니다.</span>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleLogin}>submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

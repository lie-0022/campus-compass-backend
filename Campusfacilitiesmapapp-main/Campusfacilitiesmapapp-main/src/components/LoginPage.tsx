import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Lock, Mail, User, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
}

export function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignup) {
      if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (name.trim() === '') {
        alert('이름을 입력해주세요.');
        return;
      }
      onSignup(email, password, name);
      setIsSignup(false);
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
    } else {
      onLogin(email, password);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-[#255AA6]/10 p-4">
      <Card className="w-full max-w-md shadow-lg border-gray-200">
        <CardHeader className="space-y-1 bg-gradient-to-r from-gray-50 to-[#255AA6]/10">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#255AA6]" />
            </button>
            <h1 className="text-[#255AA6]">Campus Compass</h1>
            <div className="w-9" /> {/* Spacer for alignment */}
          </div>
          <CardTitle className="text-center text-[#255AA6]">
            {isSignup ? '회원가입' : '로그인'}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            {isSignup 
              ? '새 계정을 만들어 즐겨찾기를 이용하세요' 
              : '계정에 로그인하여 즐겨찾기를 이용하세요'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">이름</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-[#255AA6] focus:ring-[#255AA6]"
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-[#255AA6] focus:ring-[#255AA6]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-[#255AA6] focus:ring-[#255AA6]"
                  required
                />
              </div>
            </div>
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">비밀번호 확인</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-[#255AA6] focus:ring-[#255AA6]"
                    required
                  />
                </div>
              </div>
            )}
            <Button type="submit" className="w-full bg-[#255AA6] hover:bg-[#255AA6]/90">
              {isSignup ? '회원가입' : '로그인'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 bg-gray-50">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-2 text-gray-500">또는</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-gray-600">
              {isSignup ? '이미 계정이 있으신가요? ' : '계정이 없으신가요? '}
            </span>
            <button 
              type="button"
              onClick={toggleMode}
              className="text-[#255AA6] hover:text-[#255AA6]/80 hover:underline"
            >
              {isSignup ? '로그인' : '회원가입'}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

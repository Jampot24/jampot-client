import { BrowserRouter } from 'react-router-dom';
import { TestPage } from '../pages/TestPage';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '@web/pages/LoginPage';
import { OnboardingPage } from '@web/pages/OnboardingPage';
import { MyPage } from '@web/pages/MyPage';
import { HomePage } from '@web/pages/HomePage';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

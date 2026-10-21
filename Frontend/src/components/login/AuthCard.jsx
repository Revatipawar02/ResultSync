import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-[650px] mx-auto flex items-center justify-center [perspective:1200px]">

      <div
        className={`relative w-full min-h-[620px] lg:min-h-[680px]
        transition-transform duration-700 
        [transform-style:preserve-3d]
        ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
      >

        {/* Login */}
        <div className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
          <LoginForm onRegister={() => setIsFlipped(true)} />
        </div>

        {/* Register */}
        <div className="absolute inset-0 flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <RegisterForm onLogin={() => setIsFlipped(false)} />
        </div>

      </div>

    </div>
  );
};

export default AuthCard;
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router';
import { LOGIN_TOKEN } from '../../App';
import { FullPage } from '../../components/styles/Container';
import { Center } from '../../components/styles/FlexBox';
import { useLoginMutation } from '../../redux/user.api';
import { setUser, setUserInfo } from '../../redux/user.reducer';
import {
  LoginBox,
  LoginButton,
  LoginInput,
  LoginMessage,
  LoginTitle,
  ValidationAlert,
} from './style';

const validation = {
  id: (value) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(value);
  },
  password: (value) => {
    return value.length >= 10;
  },
};

const Login = () => {
  const [form, setForm] = useState({
    id: { value: '', isValid: false },
    password: { value: '', isValid: false },
  });
  const { id, password } = form;

  const token = useSelector((state) => state.userInfo.token);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    const isValid = validation[name](value);
    setForm((prev) => ({ ...prev, [name]: { value, isValid } }));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!id.isValid || !password.isValid) {
      window.alert('아이디 혹은 비밀번호의 형식을 확인해주세요.');
      return;
    }
    const res = await login({
      email: id.value,
      password: password.value,
    });
    console.log(res)
    if (res.error) return window.alert('서버 연결을 확인해주세요.');
    if (!res.data.length) {
      window.alert('아이디와 비밀번호를 확인해주세요.');
      return;
    }
    dispatch(setUserInfo({ ...res.data[0], token: LOGIN_TOKEN }));
    navigate('/forum');
  };

  return (
    <>
      {token && <Navigate to="/forum" replace />}
      <FullPage>
        <Center>
          <LoginBox>
            <LoginTitle>Willing to Explore?</LoginTitle>
            <LoginMessage>매일매일 모험하며 제대로 배우자</LoginMessage>
            <form onSubmit={handleLogin}>
              <LoginInput
                placeholder="사용자명 또는 이메일 주소"
                name="id"
                value={id.value}
                onChange={onChange}
              />
              <ValidationAlert>
                {!id.isValid && '이메일타입으로 입력해주세요.'}
              </ValidationAlert>
              <LoginInput
                placeholder="비밀번호"
                name="password"
                type="password"
                value={password.value}
                onChange={onChange}
              />
              <ValidationAlert>
                {!password.isValid && '10글자 이상 입력해주세요.'}
              </ValidationAlert>
              <LoginButton type="submit">로그인</LoginButton>
            </form>
          </LoginBox>
        </Center>
      </FullPage>
    </>
  );
};

export default React.memo(Login);

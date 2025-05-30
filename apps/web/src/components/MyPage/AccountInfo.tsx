import styled from '@emotion/styled';
import { fetcher } from '@repo/api';
import { Toggle } from '@repo/ui';

type AccountInfoProps = {
  isPublic: boolean;
  calenderServiceAgreement: boolean;
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
  setCalenderServiceAgreement: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AccountInfo = ({
  isPublic,
  calenderServiceAgreement,
  setIsPublic,
  setCalenderServiceAgreement,
}: AccountInfoProps) => {
  const handleLogout = async () => {
    try {
      await fetcher.post('/users/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      '정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
    );

    if (confirmDelete) {
      try {
        await fetcher.delete('/users/delete');
        window.location.href = '/';
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
      }
    } else {
      console.log('회원 탈퇴가 취소되었습니다.');
    }
  };

  return (
    <div>
      <FormContainer>
        <CalendarContainer>
          <TextContainer>🗓️ 캘린더 권한 허용</TextContainer>
          <Toggle
            checked={calenderServiceAgreement}
            onChange={() =>
              setCalenderServiceAgreement(!calenderServiceAgreement)
            }
          />
        </CalendarContainer>
        <GapContainer />
        <CalendarContainer>
          <TextContainer>🌐 공개 허용</TextContainer>
          <Toggle checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
        </CalendarContainer>
        <GapContainer />
        <TextContainer onClick={handleLogout}>📞 로그아웃</TextContainer>
        <GapContainer />
        <TextContainer onClick={handleDelete}>🍭 회원 탈퇴</TextContainer>
      </FormContainer>
    </div>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 40px;
  border-radius: 16px;
  gap: 12px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.13);
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.palette.white};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  justify-content: center;
  width: 100%;
  white-space: nowrap;

  color: ${({ theme }) => theme.palette.gray700};
  ${({ theme }) => theme.typo.label1m};

  cursor: pointer;
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;

  & > div:last-of-type {
    flex-shrink: 0;
  }
`;

const GapContainer = styled.div`
  display: flex;
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.palette.gray100};
`;

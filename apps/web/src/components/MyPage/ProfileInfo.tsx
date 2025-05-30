import styled from '@emotion/styled';
import { fetcher } from '@repo/api';
import { Button, ButtonTextField, Dropdown } from '@repo/ui';
import {
  GENRES,
  SESSION_LABEL_TO_VALUE,
  SESSION_LABELS,
  SESSION_VALUE_TO_LABEL,
} from '@web/constants/onboarding';
import { useMemo, useRef, useState } from 'react';

type ProfileInfoProps = {
  sessionList: string[];
  setSessionList: (sessions: string[]) => void;
  genreList: string[];
  setGenreList: (genres: string[]) => void;
  audioFileUrl: string;
  setAudioFileUrl: (url: string) => void;
  onSave: () => void;
};

export const ProfileInfo = ({
  sessionList,
  setSessionList,
  genreList,
  setGenreList,
  audioFileUrl,
  setAudioFileUrl,
  onSave,
}: ProfileInfoProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const handleFileClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetcher.post<{ profileAudioUrl: string }>(
        '/users/upload-profile-audio',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setAudioFileUrl(res.profileAudioUrl);
      setFileName(file.name);
    } catch (err) {
      alert('오디오 업로드에 실패했습니다.');
      console.error(err);
    }
  };

  const selectedSessionLabels = useMemo(() => {
    return Array.from(
      new Set(sessionList.map((v) => SESSION_VALUE_TO_LABEL[v]))
    );
  }, [sessionList]);

  return (
    <div>
      <FormContainer>
        <SectionContainer>
          세션 정하기
          <Dropdown
            title="세션 선택"
            contents={SESSION_LABELS}
            selectedContents={selectedSessionLabels}
            setSelectedContents={(labels) => {
              const uniqueValues = Array.from(
                new Set(
                  labels.map(
                    (l) =>
                      SESSION_LABEL_TO_VALUE[
                        l as keyof typeof SESSION_LABEL_TO_VALUE
                      ]
                  )
                )
              );
              setSessionList(uniqueValues);
            }}
            width="434px"
          />
        </SectionContainer>
        <SectionContainer>
          장르 정하기
          <Dropdown
            title="장르 선택"
            contents={GENRES}
            selectedContents={genreList}
            setSelectedContents={setGenreList}
            width="434px"
          />
        </SectionContainer>
        <SectionContainer>
          15초 오디오
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            ref={fileRef}
            style={{ display: 'none' }}
          />
          <ButtonTextField
            width="434px"
            value={fileName}
            placeholder="오디오 파일 선택"
            readOnly
            buttonText="올리기"
            buttonClickHandler={handleFileClick}
          />
          {audioFileUrl && (
            <audio
              controls
              src={audioFileUrl}
              style={{ width: '434px', marginTop: '10px' }}
            >
              브라우저가 오디오를 지원하지 않습니다.
            </audio>
          )}
        </SectionContainer>
        <ButtonContainer>
          <Button colorTheme="yellow2" height="48px" onClick={onSave}>
            저장하기
          </Button>
        </ButtonContainer>
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
  gap: 32px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.13);
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.palette.white};
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  ${({ theme }) => theme.typo.body2m};
  color: ${({ theme }) => theme.palette.gray700};
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 105px;
`;

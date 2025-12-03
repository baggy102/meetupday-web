'use client';

import { useState, useEffect } from 'react';
import { Modal, Drawer, Space, Typography, Button, Input, Tag, message } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { MeetingCalendar } from './MeetingCalendar';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface MeetingRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (dates: Date[], purpose: string) => void;
  companyName: string;
}

export function MeetingRequestModal({
  open,
  onClose,
  onSubmit,
  companyName,
}: MeetingRequestModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [purpose, setPurpose] = useState('');

  const handleDateRemove = (dateToRemove: Date) => {
    setSelectedDates(selectedDates.filter(
      date => date.toDateString() !== dateToRemove.toDateString()
    ));
  };

  const handleSubmit = () => {
    if (selectedDates.length === 0) {
      message.error('최소 1개의 날짜를 선택해주세요.');
      return;
    }

    if (selectedDates.length > 3) {
      message.error('최대 3개의 날짜만 선택 가능합니다.');
      return;
    }

    onSubmit(selectedDates, purpose);
    // 리셋
    setSelectedDates([]);
    setPurpose('');
    onClose();
  };

  const handleClose = () => {
    setSelectedDates([]);
    setPurpose('');
    onClose();
  };

  const content = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 캘린더 */}
      <div>
        <Text style={{ fontSize: '14px', color: '#6B7280', display: 'block', marginBottom: '12px' }}>
          가능한 날짜를 선택해주세요 (최대 3개)
        </Text>
        <MeetingCalendar
          selectedDates={selectedDates}
          onDatesChange={(dates) => {
            if (dates.length > 3) {
              message.warning('최대 3개까지 선택할 수 있어요');
              return;
            }
            setSelectedDates(dates);
          }}
          maxSelections={3}
        />
      </div>

      {/* 선택된 날짜 chips */}
      {selectedDates.length > 0 && (
        <div>
          <Text style={{ fontSize: '14px', color: '#6B7280', display: 'block', marginBottom: '12px' }}>
            선택된 날짜
          </Text>
          <Space wrap>
            {selectedDates.map((date, index) => (
              <Tag
                key={index}
                closable
                onClose={() => handleDateRemove(date)}
                style={{
                  padding: '6px 12px',
                  fontSize: '14px',
                  borderRadius: '16px',
                  background: '#F5F5F5',
                  color: '#0F172A',
                  border: '1px solid #EAEAEA',
                }}
              >
                {date.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </Tag>
            ))}
          </Space>
        </div>
      )}

      {/* 밋업 목적 입력 */}
      <div>
        <Text style={{ fontSize: '14px', color: '#6B7280', display: 'block', marginBottom: '8px' }}>
          밋업 목적 (선택사항)
        </Text>
        <TextArea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="밋업을 통해 논의하고 싶은 주제나 목적을 입력해주세요."
          rows={4}
          maxLength={500}
          showCount
          style={{
            borderRadius: '8px',
          }}
        />
      </div>

      {/* 제출 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <Button onClick={handleClose} size="large">
          취소
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          disabled={selectedDates.length === 0}
          style={{
            borderRadius: '8px',
            fontWeight: 600,
          }}
        >
          신청하기
        </Button>
      </div>
    </Space>
  );

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onClose={handleClose}
        title={
          <Title level={4} style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            <CalendarOutlined style={{ marginRight: '8px', color: '#2563EB' }} />
            {companyName} 밋업 신청
          </Title>
        }
        placement="bottom"
        height="90vh"
        styles={{
          body: {
            padding: '24px',
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={900}
      title={
        <div>
          <Title level={4} style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            <CalendarOutlined style={{ marginRight: '8px', color: '#2563EB' }} />
            {companyName} 밋업 신청
          </Title>
        </div>
      }
      styles={{
        body: {
          padding: '24px',
        },
      }}
    >
      {content}
    </Modal>
  );
}


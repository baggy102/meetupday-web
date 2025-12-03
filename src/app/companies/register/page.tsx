'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, createCompany } from '@/lib/api';
import { Industry } from '@/types';
import { Form, Input, Select, Button, Card, Upload, message, Space, Typography } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;
const { Dragger } = Upload;

const industries: Industry[] = ['IT', '마케팅', '헬스케어', 'AI'];

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState<UploadFile | null>(null);
  const [logoBase64, setLogoBase64] = useState<string>('');

  const handleSubmit = async (values: any) => {
    const user = getCurrentUser();
    if (!user || !user.isVerified) {
      message.error('사업자 인증이 필요합니다.');
      return;
    }

    const technologies = values.mainTechnologies
      ? values.mainTechnologies.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
      : [];

    const company = createCompany({
      userId: user.id,
      name: values.name,
      industry: values.industry,
      description: values.description,
      mainTechnologies: technologies,
      companySize: values.companySize || '',
      website: values.website || undefined,
      logo: logoBase64 || undefined,
    });

    message.success('회사 등록이 완료되었습니다.');
    router.push(`/companies/${company.id}`);
  };

  const handleLogoChange = (info: any) => {
    const file = info.file;
    
    if (file.status === 'removed') {
      setLogoFile(null);
      setLogoBase64('');
      return;
    }

    if (file.originFileObj) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoBase64(base64String);
      };
      reader.readAsDataURL(file.originFileObj);
      setLogoFile(file);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('이미지 파일만 업로드 가능합니다.');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('이미지는 2MB 이하여야 합니다.');
      return false;
    }
    return false; // 자동 업로드 방지
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <Card>
        <Title level={2} style={{ marginBottom: '24px' }}>회사 등록</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="회사 로고"
            name="logo"
          >
            <Dragger
              name="logo"
              accept="image/*"
              maxCount={1}
              beforeUpload={beforeUpload}
              onChange={handleLogoChange}
              fileList={logoFile ? [logoFile] : []}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">클릭하거나 파일을 드래그하여 업로드</p>
              <p className="ant-upload-hint">
                회사 로고 또는 마크를 업로드하세요 (최대 2MB)
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            label="회사명"
              name="name"
            rules={[{ required: true, message: '회사명을 입력해주세요.' }]}
          >
            <Input placeholder="회사명을 입력하세요" size="large" />
          </Form.Item>

          <Form.Item
            label="산업 분야"
              name="industry"
            rules={[{ required: true, message: '산업 분야를 선택해주세요.' }]}
            >
            <Select placeholder="산업 분야를 선택하세요" size="large">
              {industries.map((industry) => (
                <Select.Option key={industry} value={industry}>
                  {industry}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="회사 소개"
              name="description"
            rules={[{ required: true, message: '회사 소개를 입력해주세요.' }]}
          >
            <TextArea 
              rows={4}
              placeholder="회사에 대해 설명해주세요"
            />
          </Form.Item>

          <Form.Item
            label="대표 기술"
              name="mainTechnologies"
          >
            <Input 
              placeholder="예: React, Node.js, TypeScript (쉼표로 구분)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="회사 규모"
              name="companySize"
          >
            <Input 
              placeholder="예: 10-50명"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="웹사이트"
              name="website"
          >
            <Input 
              placeholder="https://example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
              등록하기
              </Button>
              <Button onClick={() => router.back()} size="large">
              취소
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}


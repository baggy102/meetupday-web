'use client';

import { Company } from '@/types';
import { Building2, Users, Code } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
  isClickable: boolean;
}

export function CompanyCard({ company, onClick, isClickable }: CompanyCardProps) {
  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`
        bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all
        ${isClickable 
          ? 'hover:shadow-lg hover:scale-105' 
          : 'opacity-60 cursor-not-allowed'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          {company.industry}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{company.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-2" />
          {company.companySize}
        </div>
        {company.mainTechnologies.length > 0 && (
          <div className="flex items-center text-sm text-gray-500">
            <Code className="w-4 h-4 mr-2" />
            <span className="truncate">
              {company.mainTechnologies.join(', ')}
            </span>
          </div>
        )}
      </div>

      {!isClickable && (
        <div className="text-xs text-red-500 mt-2">
          * 사업자 인증이 필요합니다
        </div>
      )}
    </div>
  );
}


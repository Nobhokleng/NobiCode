import React, { useState } from 'react';
import { CodeReviewHistoryItem, Language } from '../types/services';
import { formatHistoryTimestamp } from '../utils/historyStorage';
import { useTheme } from '../contexts/ThemeContext';

interface HistoryItemProps {
  item: CodeReviewHistoryItem;
  onView: (item: CodeReviewHistoryItem) => void;
  onDelete: (id: string) => void;
  language: Language;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  onView,
  onDelete,
  language
}) => {
  const { themeColors } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getTranslations = () => {
    const translations = {
      en: {
        view: 'View',
        delete: 'Delete',
        confirmDelete: 'Are you sure you want to delete this review?',
        cancel: 'Cancel',
        confirm: 'Delete',
        model: 'Model',
        service: 'Service'
      },
      km: {
        view: 'មើល',
        delete: 'លុប',
        confirmDelete: 'តើអ្នកប្រាកដថាចង់លុបការពិនិត្យនេះមែនទេ?',
        cancel: 'បោះបង់',
        confirm: 'លុប',
        model: 'ម៉ូដែល',
        service: 'សេវាកម្ម'
      },
      es: {
        view: 'Ver',
        delete: 'Eliminar',
        confirmDelete: '¿Estás seguro de que quieres eliminar esta revisión?',
        cancel: 'Cancelar',
        confirm: 'Eliminar',
        model: 'Modelo',
        service: 'Servicio'
      },
      fr: {
        view: 'Voir',
        delete: 'Supprimer',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette révision?',
        cancel: 'Annuler',
        confirm: 'Supprimer',
        model: 'Modèle',
        service: 'Service'
      },
      zh: {
        view: '查看',
        delete: '删除',
        confirmDelete: '您确定要删除此审查吗？',
        cancel: '取消',
        confirm: '删除',
        model: '模型',
        service: '服务'
      },
      ja: {
        view: '表示',
        delete: '削除',
        confirmDelete: 'このレビューを削除してもよろしいですか？',
        cancel: 'キャンセル',
        confirm: '削除',
        model: 'モデル',
        service: 'サービス'
      },
      ko: {
        view: '보기',
        delete: '삭제',
        confirmDelete: '이 리뷰를 삭제하시겠습니까?',
        cancel: '취소',
        confirm: '삭제',
        model: '모델',
        service: '서비스'
      },
      vi: {
        view: 'Xem',
        delete: 'Xóa',
        confirmDelete: 'Bạn có chắc chắn muốn xóa đánh giá này không?',
        cancel: 'Hủy',
        confirm: 'Xóa',
        model: 'Mô hình',
        service: 'Dịch vụ'
      },
      th: {
        view: 'ดู',
        delete: 'ลบ',
        confirmDelete: 'คุณแน่ใจหรือไม่ว่าต้องการลบการตรวจสอบนี้?',
        cancel: 'ยกเลิก',
        confirm: 'ลบ',
        model: 'รุ่น',
        service: 'บริการ'
      }
    };
    return translations[language] || translations.en;
  };

  const t = getTranslations();

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(item.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`${themeColors.backgroundTertiary} rounded-lg p-4 ${themeColors.border} hover:border-purple-500 hover:shadow-lg transition-all duration-200 cursor-pointer group`}>
      {/* Header with timestamp and service info */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1" onClick={() => onView(item)}>
          <div className={`text-sm ${themeColors.textSecondary} mb-1 font-medium`}>
            {formatHistoryTimestamp(item.timestamp, language)}
          </div>
          <div className={`text-xs ${themeColors.textMuted}`}>
            <span className={`inline-flex items-center px-2 py-1 rounded-full ${themeColors.buttonSecondary} ${themeColors.textSecondary} mr-2`}>
              {item.service}
            </span>
            <span className={themeColors.textMuted}>{item.model}</span>
          </div>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(item);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full transition-colors shadow-md hover:shadow-lg"
            title={t.view}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          {!showDeleteConfirm ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-full transition-colors shadow-md hover:shadow-lg"
              title={t.delete}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ) : (
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelDelete();
                }}
                className={`px-2 py-1 border text-xs rounded-full transition-colors ${
                  themeColors.backgroundSecondary.includes('bg-white')
                    ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                }`}
              >
                ✕
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-full transition-colors"
              >
                ✓
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Code preview */}
      <div
        className={`${themeColors.backgroundSecondary} rounded-lg p-3 ${themeColors.border} group-hover:border-gray-500 transition-colors`}
        onClick={() => onView(item)}
      >
        <pre className={`text-sm ${themeColors.textSecondary} whitespace-pre-wrap break-words font-mono leading-relaxed`}>
          {item.codePreview}
        </pre>
      </div>
    </div>
  );
};

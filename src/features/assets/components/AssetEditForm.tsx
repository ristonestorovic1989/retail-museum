'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { ASSET_TYPE_TRANSLATION_KEYS, LANGUAGE_OPTIONS, type LanguageCode } from '../constants';
import type { AssetEditViewModel } from '../types';
import { useTranslateTextMutation } from '../api.client';
import { AssetEditHeader } from './AssetEditForm/AssetEditHeader';
import { AssetDetailsCard } from './AssetEditForm/AssetDetailsCard';
import { TranslationsCard } from './AssetEditForm/AssetTranslationsCard';

type TranslationsMap = { [key: string]: string };

type AssetEditFormProps = {
  asset: AssetEditViewModel;
  onSave: (payload: {
    asset: AssetEditViewModel;
    mainDescription: string;
    translations: TranslationsMap;
  }) => Promise<void> | void;
  onCancel: () => void;
  initialMainDescription?: string;
  initialTranslations?: TranslationsMap;
};

export function AssetEditForm({
  asset: initialAsset,
  onSave,
  onCancel,
  initialMainDescription = '',
  initialTranslations = {},
}: AssetEditFormProps) {
  const t = useTranslations('assets.edit');
  const tLang = useTranslations('languages');

  const initialLangsFromTranslations: LanguageCode[] = Object.keys(initialTranslations)
    .map((code) => code.toLowerCase() as LanguageCode)
    .filter((code) => LANGUAGE_OPTIONS.some((l) => l.code === code));

  const defaultLangs: LanguageCode[] = ['en', 'sr', 'de'];

  const initialSelectedLanguages: LanguageCode[] =
    initialLangsFromTranslations.length > 0
      ? (Array.from(
          new Set<LanguageCode>([...initialLangsFromTranslations, ...defaultLangs]),
        ) as LanguageCode[])
      : defaultLangs;

  const [asset, setAsset] = useState<AssetEditViewModel>(initialAsset);
  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);
  const [translations, setTranslations] = useState<TranslationsMap>(initialTranslations);
  const [selectedLanguages, setSelectedLanguages] =
    useState<LanguageCode[]>(initialSelectedLanguages);
  const [mainDescription, setMainDescription] = useState(initialMainDescription);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  const { mutateAsync: translateText, isPending: isTranslating } = useTranslateTextMutation();

  const typeLabel = asset.type ? t(ASSET_TYPE_TRANSLATION_KEYS[asset.type]) : '';

  const handleSaveClick = async () => {
    try {
      setIsSaving(true);

      await Promise.resolve(
        onSave({
          asset,
          mainDescription,
          translations,
        }),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoTranslateClick = async (langCode: LanguageCode) => {
    if (!mainDescription.trim()) {
      toast.warning(t('translations.noSourceDescription'), {
        description: t('translations.noSourceDescriptionHint'),
      });
      return;
    }

    try {
      const apiTranslations = await translateText({
        langs: [langCode],
        text: mainDescription,
      });

      const translatedText =
        apiTranslations[langCode] || apiTranslations[langCode.toUpperCase()] || mainDescription;

      setTranslations((prev) => ({
        ...prev,
        [langCode]: translatedText,
      }));

      toast.success(t('translations.autoTranslatePlaceholder'), {
        description: t('translations.autoTranslatePlaceholderHint', {
          lang: tLang(langCode),
        }),
      });
    } catch (error) {
      console.error(error);
      toast.error('Auto-translate failed');
    }
  };

  const handleToggleLanguage = (langCode: LanguageCode, checked: boolean) => {
    const langName = tLang(langCode);

    if (checked) {
      setSelectedLanguages((prev) => (prev.includes(langCode) ? prev : [...prev, langCode]));

      toast.success(t('toasts.languageAddedTitle'), {
        description: t('toasts.languageAddedDescription', {
          lang: langName,
        }),
      });
    } else {
      setSelectedLanguages((prev) => prev.filter((l) => l !== langCode));
      setTranslations((prev) => {
        const next = { ...prev };
        delete next[langCode];
        return next;
      });

      toast.info(t('toasts.languageRemovedTitle'), {
        description: t('toasts.languageRemovedDescription', {
          lang: langName,
        }),
      });
    }
  };

  const handleRemoveLanguage = (langCode: LanguageCode) => {
    const langName = tLang(langCode);

    setSelectedLanguages((prev) => prev.filter((l) => l !== langCode));
    setTranslations((prev) => {
      const next = { ...prev };
      delete next[langCode];
      return next;
    });

    toast.info(t('toasts.languageRemovedTitle'), {
      description: t('toasts.languageRemovedDescription', { lang: langName }),
    });
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;

    if (asset.tags.includes(tag)) {
      toast.warning(t('tags.alreadyExists'), {
        description: t('tags.alreadyExistsDescription'),
      });
      return;
    }

    setAsset((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setNewTag('');

    toast.success(t('tags.added'));
  };

  const handleRemoveTag = (index: number) => {
    const tag = asset.tags[index];
    const newTags = asset.tags.filter((_, i) => i !== index);

    setAsset((prev) => ({ ...prev, tags: newTags }));

    toast.info(t('tags.removed', { tag }));
  };

  return (
    <div className="space-y-6">
      <AssetEditHeader
        isSaving={isSaving}
        onCancel={onCancel}
        onSave={handleSaveClick}
        title={t('title')}
        subtitle={t('subtitle')}
        assetName={asset.name}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AssetDetailsCard
          t={t}
          asset={asset}
          typeLabel={typeLabel}
          newTag={newTag}
          onChangeAsset={(updater) => setAsset((prev) => updater(prev))}
          onChangeNewTag={setNewTag}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          mainDescription={mainDescription}
          onChangeMainDescription={setMainDescription}
        />

        <TranslationsCard
          t={t}
          tLang={tLang}
          isTranslationDialogOpen={isTranslationDialogOpen}
          onTranslationDialogOpenChange={setIsTranslationDialogOpen}
          selectedLanguages={selectedLanguages}
          translations={translations}
          onToggleLanguage={handleToggleLanguage}
          onRemoveLanguage={handleRemoveLanguage}
          onChangeTranslation={(langCode, value) =>
            setTranslations((prev) => ({
              ...prev,
              [langCode]: value,
            }))
          }
          onAutoTranslate={handleAutoTranslateClick}
          isTranslating={isTranslating}
          mainDescription={mainDescription}
        />
      </div>
    </div>
  );
}

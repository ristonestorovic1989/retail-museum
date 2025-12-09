'use client';

import { useState } from 'react';
import { FileImage, ArrowLeft, Save, Trash2, Plus, Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import {
  ASSET_STATUSES,
  ASSET_STATUS_TRANSLATION_KEYS,
  ASSET_TYPE_TRANSLATION_KEYS,
  LANGUAGE_OPTIONS,
  type AssetStatus,
  type LanguageCode,
} from '../constants';
import { AppSelect } from '@/components/shared/app-select';
import type { AssetEditViewModel } from '../types';

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

  const [asset, setAsset] = useState<AssetEditViewModel>(initialAsset);
  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);
  const [translations, setTranslations] = useState<TranslationsMap>(initialTranslations);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>(['en', 'sr', 'de']);
  const [mainDescription, setMainDescription] = useState(initialMainDescription);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

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

  const handleAutoTranslateClick = (langCode: LanguageCode) => {
    if (!mainDescription.trim()) {
      toast.warning(t('translations.noSourceDescription'), {
        description: t('translations.noSourceDescriptionHint'),
      });
      return;
    }

    setTranslations((prev) => ({
      ...prev,
      [langCode]: prev[langCode] || mainDescription,
    }));

    toast.success(t('translations.autoTranslatePlaceholder'), {
      description: t('translations.autoTranslatePlaceholderHint', {
        lang: tLang(langCode),
      }),
    });
  };

  const removeLanguage = (langCode: LanguageCode) => {
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

  const typeLabel = asset.type ? t(ASSET_TYPE_TRANSLATION_KEYS[asset.type]) : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel} aria-label={t('actions.back')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
            <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleSaveClick} className="gap-2" disabled={isSaving}>
            <Save className="h-4 w-4" />
            {isSaving ? t('actions.saving') : t('actions.saveChanges')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('sections.details.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded bg-background overflow-hidden">
                  {asset.previewUrl ? (
                    <Image
                      src={asset.previewUrl}
                      alt={asset.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FileImage className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{asset.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{asset.format.toUpperCase()}</span>
                    <span>•</span>
                    <span>
                      {(asset.size / 1024 / 1024).toFixed(2)} {t('fields.sizeUnit')}
                    </span>
                    <span>•</span>
                    <span>{asset.dateOfUploadingFormatted}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="asset-name">{t('fields.name.label')}</Label>
                  <Input
                    id="asset-name"
                    value={asset.name}
                    onChange={(e) =>
                      setAsset((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder={t('fields.name.placeholder')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('fields.type.label')}</Label>
                    <Input value={typeLabel} disabled className="bg-muted" />
                  </div>

                  <AppSelect<AssetStatus>
                    id="asset-status"
                    label={t('fields.status.label')}
                    placeholder={t('fields.status.placeholder')}
                    value={asset.status}
                    onChange={(v) =>
                      setAsset((prev) => ({
                        ...prev,
                        status: v,
                      }))
                    }
                    options={ASSET_STATUSES.map((value) => ({
                      value,
                      label: t(
                        ASSET_STATUS_TRANSLATION_KEYS[
                          value.toLowerCase() as Lowercase<AssetStatus>
                        ],
                      ),
                    }))}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="asset-format">{t('fields.format.label')}</Label>
                    <Input
                      id="asset-format"
                      value={asset.format.toUpperCase()}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('fields.tags.label')}</Label>
                  <div className="flex flex-wrap gap-2 rounded-lg border p-3">
                    {asset.tags.map((tag, index) => (
                      <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveTag(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder={t('fields.tags.placeholder')}
                        className="h-7 w-32 text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7"
                        onClick={handleAddTag}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        {t('fields.tags.add')}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asset-description">{t('fields.mainDescription.label')}</Label>
                  <Textarea
                    id="asset-description"
                    placeholder={t('fields.mainDescription.placeholder')}
                    rows={4}
                    className="resize-none"
                    value={mainDescription}
                    onChange={(e) => setMainDescription(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('fields.mainDescription.helper')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>{t('sections.translations.title')}</CardTitle>
                </div>
                <Dialog open={isTranslationDialogOpen} onOpenChange={setIsTranslationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      {t('sections.translations.addLanguage')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t('sections.translations.dialogTitle')}</DialogTitle>
                      <DialogDescription>
                        {t('sections.translations.dialogDescription')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {LANGUAGE_OPTIONS.map((lang) => {
                        const isChecked = selectedLanguages.includes(lang.code);
                        const langName = tLang(lang.code);

                        return (
                          <div key={lang.code} className="flex items-center space-x-3">
                            <Checkbox
                              id={lang.code}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedLanguages((prev) =>
                                    prev.includes(lang.code) ? prev : [...prev, lang.code],
                                  );

                                  toast.success(t('toasts.languageAddedTitle'), {
                                    description: t('toasts.languageAddedDescription', {
                                      lang: langName,
                                    }),
                                  });
                                } else {
                                  setSelectedLanguages((prev) =>
                                    prev.filter((l) => l !== lang.code),
                                  );
                                  setTranslations((prev) => {
                                    const next = { ...prev };
                                    delete next[lang.code];
                                    return next;
                                  });

                                  toast.info(t('toasts.languageRemovedTitle'), {
                                    description: t('toasts.languageRemovedDescription', {
                                      lang: langName,
                                    }),
                                  });
                                }
                              }}
                            />
                            <Label
                              htmlFor={lang.code}
                              className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                            >
                              <span className="text-xl">{lang.flag}</span>
                              <span>{langName}</span>
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedLanguages.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Languages className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>{t('sections.translations.emptyTitle')}</p>
                  <p className="mt-1 text-sm">{t('sections.translations.emptySubtitle')}</p>
                </div>
              ) : (
                selectedLanguages.map((langCode) => {
                  const lang = LANGUAGE_OPTIONS.find((l) => l.code === langCode);
                  if (!lang) return null;

                  return (
                    <div key={langCode} className="space-y-2 rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{lang.flag}</span>
                          <Label className="font-medium">{tLang(langCode)}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAutoTranslateClick(langCode)}
                            disabled={!mainDescription.trim()}
                          >
                            {t('translations.autoTranslateButton')}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeLanguage(langCode)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        placeholder={t('translations.textareaPlaceholder', {
                          lang: tLang(langCode),
                        })}
                        rows={3}
                        className="resize-none"
                        value={translations[langCode] || ''}
                        onChange={(e) =>
                          setTranslations((prev) => ({
                            ...prev,
                            [langCode]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

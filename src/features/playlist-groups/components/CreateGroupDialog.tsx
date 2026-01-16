'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Languages, Plus, Trash2 } from 'lucide-react';

import { AppDialog } from '@/components/shared/app-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// ✅ preporuka: izvući u shared (da i assets i playlist-groups koriste isto)
import { LANGUAGE_OPTIONS, type LanguageCode } from '@/features/assets/constants';

type TranslationsMap = Partial<Record<LanguageCode, string>>;

type FormValues = {
  name: string;
  description: string;
  imageUrl: string;
  backgroundUrl: string;
  playlistIds: number[];
  descriptionTranslations?: TranslationsMap;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isSaving: boolean;
  onSubmit: (values: FormValues) => void | Promise<void>;
};

function parseIds(s: string): number[] {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function CreateGroupDialog({ open, onOpenChange, isSaving, onSubmit }: Props) {
  const t = useTranslations('playlistGroups');
  const tLang = useTranslations('languages');

  const defaultLangs: LanguageCode[] = ['en', 'sr', 'de'];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [playlistIdsText, setPlaylistIdsText] = useState('');

  const [isTranslationDialogOpen, setIsTranslationDialogOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>(defaultLangs);
  const [descriptionTranslations, setDescriptionTranslations] = useState<TranslationsMap>({});

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  const handleReset = useCallback(() => {
    setName('');
    setDescription('');
    setImageUrl('');
    setBackgroundUrl('');
    setPlaylistIdsText('');

    setIsTranslationDialogOpen(false);
    setSelectedLanguages(defaultLangs);
    setDescriptionTranslations({});
  }, []);

  const handleToggleLanguage = useCallback((langCode: LanguageCode, checked: boolean) => {
    if (checked) {
      setSelectedLanguages((prev) => (prev.includes(langCode) ? prev : [...prev, langCode]));
      return;
    }

    setSelectedLanguages((prev) => prev.filter((l) => l !== langCode));
    setDescriptionTranslations((prev) => {
      const next = { ...prev };
      delete next[langCode];
      return next;
    });
  }, []);

  const handleRemoveLanguage = useCallback((langCode: LanguageCode) => {
    setSelectedLanguages((prev) => prev.filter((l) => l !== langCode));
    setDescriptionTranslations((prev) => {
      const next = { ...prev };
      delete next[langCode];
      return next;
    });
  }, []);

  const handleChangeTranslation = useCallback((langCode: LanguageCode, value: string) => {
    setDescriptionTranslations((prev) => ({ ...prev, [langCode]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      backgroundUrl: backgroundUrl.trim(),
      playlistIds: parseIds(playlistIdsText),
      descriptionTranslations,
    });
  }, [
    backgroundUrl,
    description,
    descriptionTranslations,
    imageUrl,
    name,
    onSubmit,
    playlistIdsText,
  ]);

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('dialogs.createGroup.title')}
      description={t('dialogs.createGroup.description')}
      cancelLabel={t('common.cancel')}
      primaryAction={{
        label: isSaving ? t('common.saving') : t('common.save'),
        onClick: handleSubmit,
        disabled: !canSave || isSaving,
      }}
      onRequestClose={handleReset}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>{t('dialogs.createGroup.fields.name')}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>{t('dialogs.createGroup.fields.description')}</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* ✅ translations (assets-style) */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{t('dialogs.createGroup.translations.title')}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('dialogs.createGroup.translations.subtitle')}
              </p>
            </div>

            <Dialog open={isTranslationDialogOpen} onOpenChange={setIsTranslationDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('dialogs.createGroup.translations.addLanguage')}
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('dialogs.createGroup.translations.dialogTitle')}</DialogTitle>
                  <DialogDescription>
                    {t('dialogs.createGroup.translations.dialogDescription')}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const isChecked = selectedLanguages.includes(lang.code);
                    return (
                      <div key={lang.code} className="flex items-center space-x-3">
                        <Checkbox
                          id={`pg-lang-${lang.code}`}
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleToggleLanguage(lang.code, Boolean(checked))
                          }
                        />
                        <Label
                          htmlFor={`pg-lang-${lang.code}`}
                          className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span>{tLang(lang.code)}</span>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {selectedLanguages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('dialogs.createGroup.translations.empty')}
            </p>
          ) : (
            <div className="space-y-3">
              {selectedLanguages.map((langCode) => {
                const lang = LANGUAGE_OPTIONS.find((l) => l.code === langCode);
                if (!lang) return null;

                return (
                  <div key={langCode} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{lang.flag}</span>
                        <Label className="font-medium">{tLang(langCode)}</Label>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn('h-8 w-8 cursor-pointer')}
                        onClick={() => handleRemoveLanguage(langCode)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Textarea
                      rows={3}
                      className="resize-none"
                      placeholder={t('dialogs.createGroup.translations.placeholder', {
                        lang: tLang(langCode),
                      })}
                      value={descriptionTranslations[langCode] || ''}
                      onChange={(e) => handleChangeTranslation(langCode, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>{t('dialogs.createGroup.fields.imageUrl')}</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>{t('dialogs.createGroup.fields.backgroundUrl')}</Label>
            <Input value={backgroundUrl} onChange={(e) => setBackgroundUrl(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('dialogs.createGroup.fields.playlistIds')}</Label>
          <Input
            placeholder="e.g. 12, 15, 18"
            value={playlistIdsText}
            onChange={(e) => setPlaylistIdsText(e.target.value)}
          />
        </div>
      </div>
    </AppDialog>
  );
}

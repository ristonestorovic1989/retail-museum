'use client';

import { Languages, Plus, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { LANGUAGE_OPTIONS, LanguageCode } from '../../constants';

type TFn = (key: string, values?: Record<string, any>) => string;
type TranslationsMap = { [key: string]: string };

type TranslationsCardProps = {
  t: TFn;
  tLang: TFn;
  isTranslationDialogOpen: boolean;
  onTranslationDialogOpenChange: (open: boolean) => void;
  selectedLanguages: LanguageCode[];
  translations: TranslationsMap;
  onToggleLanguage: (langCode: LanguageCode, checked: boolean) => void;
  onRemoveLanguage: (langCode: LanguageCode) => void;
  onChangeTranslation: (langCode: LanguageCode, value: string) => void;
  onAutoTranslate: (langCode: LanguageCode) => void;
  isTranslating: boolean;
  mainDescription: string;
};

export function TranslationsCard({
  t,
  tLang,
  isTranslationDialogOpen,
  onTranslationDialogOpenChange,
  selectedLanguages,
  translations,
  onToggleLanguage,
  onRemoveLanguage,
  onChangeTranslation,
  onAutoTranslate,
  isTranslating,
  mainDescription,
}: TranslationsCardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{t('sections.translations.title')}</CardTitle>
            </div>
            <Dialog open={isTranslationDialogOpen} onOpenChange={onTranslationDialogOpenChange}>
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
                          onCheckedChange={(checked) =>
                            onToggleLanguage(lang.code, Boolean(checked))
                          }
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
                        onClick={() => onAutoTranslate(langCode)}
                        disabled={!mainDescription.trim() || isTranslating}
                      >
                        {t('translations.autoTranslateButton')}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onRemoveLanguage(langCode)}
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
                    onChange={(e) => onChangeTranslation(langCode, e.target.value)}
                  />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  Image,
  Video,
  Clock,
  Calendar,
  Eye,
  MoreVertical,
  Layers,
  Copy,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  RotateCcw,
  Shuffle,
  Repeat,
  Move,
  Info,
  FileText,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AppDialog } from '@/components/shared/app-dialog';
import { toast } from 'sonner';

interface PlaylistAsset {
  id: number;
  name: string;
  thumbnail: string;
  type: 'image' | 'video';
  duration: number; // in seconds
  fileSize: string;
  resolution: string;
  addedAt: string;
}

interface PlaylistItem {
  id: number;
  name: string;
  thumbnail: string;
  duration: string;
  itemCount: number;
  type: 'image' | 'video' | 'mixed';
  lastModified: string;
  assets: PlaylistAsset[];
}

interface PlaylistGroup {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  color: string;
  playlists: PlaylistItem[];
}

// Mock assets for playlists
const generateMockAssets = (count: number): PlaylistAsset[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Asset ${i + 1}`,
    thumbnail: '/placeholder.svg',
    type: Math.random() > 0.5 ? 'image' : 'video',
    duration: Math.floor(Math.random() * 30) + 5,
    fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
    resolution: '1920x1080',
    addedAt: '05.02.2025',
  }));
};

const PlaylistGroupsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<number[]>([1]);

  // Preview state
  const [previewPlaylist, setPreviewPlaylist] = useState<PlaylistItem | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Player state
  const [playerPlaylist, setPlayerPlaylist] = useState<PlaylistItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [transitionDuration, setTransitionDuration] = useState(5);

  // Playlist details dialog
  const [detailsPlaylist, setDetailsPlaylist] = useState<PlaylistItem | null>(null);

  // Group dialogs state
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [createGroupName, setCreateGroupName] = useState('');
  const [createGroupDesc, setCreateGroupDesc] = useState('');

  const [editingGroup, setEditingGroup] = useState<PlaylistGroup | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupDesc, setEditGroupDesc] = useState('');

  const [deletingGroup, setDeletingGroup] = useState<PlaylistGroup | null>(null);

  // Playlist dialogs state
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistItem | null>(null);
  const [editPlaylistName, setEditPlaylistName] = useState('');
  const [deletingPlaylist, setDeletingPlaylist] = useState<PlaylistItem | null>(null);

  // Move dialog
  const [movePlaylist, setMovePlaylist] = useState<{
    playlist: PlaylistItem;
    fromGroup: PlaylistGroup;
  } | null>(null);

  const [groups, setGroups] = useState<PlaylistGroup[]>([
    {
      id: 1,
      name: 'Знаменић личности у Срба',
      description: 'Промене у друштвено-економском уређењу',
      createdAt: '07.02.2025',
      color: 'hsl(var(--chart-1))',
      playlists: [
        {
          id: 101,
          name: 'Никола Тесла',
          thumbnail: '/placeholder.svg',
          duration: '5:30',
          itemCount: 12,
          type: 'mixed',
          lastModified: '06.02.2025',
          assets: generateMockAssets(12),
        },
        {
          id: 102,
          name: 'Михајло Пупин',
          thumbnail: '/placeholder.svg',
          duration: '4:15',
          itemCount: 8,
          type: 'image',
          lastModified: '05.02.2025',
          assets: generateMockAssets(8),
        },
        {
          id: 103,
          name: 'Вук Караџић',
          thumbnail: '/placeholder.svg',
          duration: '6:00',
          itemCount: 15,
          type: 'video',
          lastModified: '04.02.2025',
          assets: generateMockAssets(15),
        },
        {
          id: 104,
          name: 'Свети Сава',
          thumbnail: '/placeholder.svg',
          duration: '3:45',
          itemCount: 6,
          type: 'image',
          lastModified: '03.02.2025',
          assets: generateMockAssets(6),
        },
        {
          id: 105,
          name: 'Доситеј Обрадовић',
          thumbnail: '/placeholder.svg',
          duration: '4:30',
          itemCount: 10,
          type: 'mixed',
          lastModified: '02.02.2025',
          assets: generateMockAssets(10),
        },
      ],
    },
    {
      id: 2,
      name: 'Колонизација - 1945. до 1948.',
      description: 'Промене у Војводини управљају се заснивали',
      createdAt: '06.02.2025',
      color: 'hsl(var(--chart-2))',
      playlists: [
        {
          id: 201,
          name: 'Долазак колониста',
          thumbnail: '/placeholder.svg',
          duration: '8:00',
          itemCount: 20,
          type: 'video',
          lastModified: '05.02.2025',
          assets: generateMockAssets(20),
        },
      ],
    },
    {
      id: 3,
      name: 'Логор Шарвар',
      description: 'Историјски преглед логора',
      createdAt: '06.02.2025',
      color: 'hsl(var(--chart-3))',
      playlists: [
        {
          id: 301,
          name: 'Документи и сведочења',
          thumbnail: '/placeholder.svg',
          duration: '12:30',
          itemCount: 25,
          type: 'mixed',
          lastModified: '05.02.2025',
          assets: generateMockAssets(25),
        },
      ],
    },
    {
      id: 4,
      name: 'Сава Текелија',
      description: 'Сава Текелија (1761 – 1842)',
      createdAt: '07.02.2025',
      color: 'hsl(var(--chart-4))',
      playlists: [
        {
          id: 401,
          name: 'Биографија',
          thumbnail: '/placeholder.svg',
          duration: '7:00',
          itemCount: 14,
          type: 'image',
          lastModified: '06.02.2025',
          assets: generateMockAssets(14),
        },
      ],
    },
  ]);

  // Sync edit form state when opening dialogs
  useEffect(() => {
    if (!editingGroup) return;
    setEditGroupName(editingGroup.name ?? '');
    setEditGroupDesc(editingGroup.description ?? '');
  }, [editingGroup]);

  useEffect(() => {
    if (!editingPlaylist) return;
    setEditPlaylistName(editingPlaylist.name ?? '');
  }, [editingPlaylist]);

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    );
  };

  // Player controls
  const handlePlayPlaylist = (playlist: PlaylistItem) => {
    setPlayerPlaylist(playlist);
    setCurrentAssetIndex(0);
    setIsPlaying(true);
    setProgress(0);
  };

  const handlePauseResume = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = useCallback(() => {
    if (!playerPlaylist) return;

    if (isShuffled) {
      setCurrentAssetIndex(Math.floor(Math.random() * playerPlaylist.assets.length));
    } else if (currentAssetIndex < playerPlaylist.assets.length - 1) {
      setCurrentAssetIndex((prev) => prev + 1);
    } else if (isLooping) {
      setCurrentAssetIndex(0);
    }
    setProgress(0);
  }, [playerPlaylist, currentAssetIndex, isLooping, isShuffled]);

  const handlePrevious = () => {
    if (!playerPlaylist) return;

    if (currentAssetIndex > 0) {
      setCurrentAssetIndex((prev) => prev - 1);
    } else if (isLooping) {
      setCurrentAssetIndex(playerPlaylist.assets.length - 1);
    }
    setProgress(0);
  };

  const handleClosePlayer = () => {
    setPlayerPlaylist(null);
    setIsPlaying(false);
    setCurrentAssetIndex(0);
    setProgress(0);
    setIsFullscreen(false);
  };

  // Auto-advance effect
  useEffect(() => {
    if (!isPlaying || !playerPlaylist || !autoAdvance) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 100 / (transitionDuration * 10);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playerPlaylist, autoAdvance, transitionDuration, handleNext]);

  // Group actions (still mock)
  const handleDuplicateGroup = (group: PlaylistGroup) => {
    const now = Date.now();
    const newGroup = {
      ...group,
      id: now,
      name: `${group.name} (Copy)`,
      playlists: group.playlists.map((p) => ({ ...p, id: now + p.id })),
    };
    setGroups((prev) => [...prev, newGroup]);

    toast.success('Group duplicated', {
      description: `"${group.name}" has been duplicated.`,
    });
  };

  // Playlist actions (still mock)
  const handleDuplicatePlaylist = (playlist: PlaylistItem, groupId: number) => {
    const newPlaylist = {
      ...playlist,
      id: Date.now(),
      name: `${playlist.name} (Copy)`,
    };
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, playlists: [...g.playlists, newPlaylist] } : g)),
    );

    toast.success('Playlist duplicated', {
      description: `"${playlist.name}" has been duplicated.`,
    });
  };

  const handleMovePlaylist = (playlist: PlaylistItem, fromGroupId: number, toGroupId: number) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === fromGroupId) {
          return { ...g, playlists: g.playlists.filter((p) => p.id !== playlist.id) };
        }
        if (g.id === toGroupId) {
          return { ...g, playlists: [...g.playlists, playlist] };
        }
        return g;
      }),
    );
    setMovePlaylist(null);

    toast.success('Playlist moved', {
      description: `"${playlist.name}" has been moved.`,
    });
  };

  const handleExportPlaylist = (playlist: PlaylistItem) => {
    toast.info('Exporting playlist', {
      description: `"${playlist.name}" is being prepared for download.`,
    });
  };

  const handleSharePlaylist = (playlist: PlaylistItem) => {
    navigator.clipboard.writeText(`https://app.example.com/playlist/${playlist.id}`);
    toast.success('Link copied', {
      description: 'Playlist link has been copied to clipboard.',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-3 w-3" />;
      case 'video':
        return <Video className="h-3 w-3" />;
      default:
        return <Layers className="h-3 w-3" />;
    }
  };

  const getTypeBadgeVariant = (type: string): 'default' | 'secondary' | 'outline' => {
    switch (type) {
      case 'image':
        return 'secondary';
      case 'video':
        return 'default';
      default:
        return 'outline';
    }
  };

  const totalPlaylists = groups.reduce((acc, group) => acc + group.playlists.length, 0);
  const currentAsset = playerPlaylist?.assets[currentAssetIndex];

  const canCreateGroup = createGroupName.trim().length > 0;
  const canEditGroup = editGroupName.trim().length > 0;
  const canEditPlaylist = editPlaylistName.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Playlist Groups</h1>
          <p className="text-muted-foreground mt-1">
            {groups.length} groups · {totalPlaylists} playlists
          </p>
        </div>

        <Button className="gap-2" onClick={() => setCreateGroupOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search groups or playlists..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Groups Grid */}
      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <Collapsible
            key={group.id}
            open={expandedGroups.includes(group.id)}
            onOpenChange={() => toggleGroup(group.id)}
          >
            <Card className="overflow-hidden">
              {/* Group Header */}
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-2 h-12 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <div className="flex items-center gap-3">
                        {expandedGroups.includes(group.id) ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {group.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Layers className="h-4 w-4" />
                          {group.playlists.length} playlists
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {group.createdAt}
                        </span>
                      </div>

                      {/* Group Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-popover border shadow-lg z-50"
                        >
                          <DropdownMenuItem onClick={() => setEditingGroup(group)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit Group
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateGroup(group)}>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate Group
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Plus className="h-4 w-4 mr-2" /> Add Playlist
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" /> Export All
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeletingGroup(group)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              {/* Playlists inside group */}
              <CollapsibleContent>
                <CardContent className="pt-0 pb-4">
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {group.playlists.map((playlist) => (
                        <Card
                          key={playlist.id}
                          className="group/card overflow-hidden hover:shadow-md transition-all cursor-pointer border-border/50 hover:border-primary/30"
                        >
                          {/* Thumbnail */}
                          <div className="relative aspect-video bg-muted">
                            <img
                              src={playlist.thumbnail}
                              alt={playlist.name}
                              className="w-full h-full object-cover"
                            />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="gap-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewPlaylist(playlist);
                                  setPreviewIndex(0);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="gap-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayPlaylist(playlist);
                                }}
                              >
                                <Play className="h-4 w-4" />
                                Play
                              </Button>
                            </div>

                            {/* Duration badge */}
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                              {playlist.duration}
                            </div>

                            {/* Type badge */}
                            <Badge
                              variant={getTypeBadgeVariant(playlist.type)}
                              className="absolute top-2 left-2 gap-1"
                            >
                              {getTypeIcon(playlist.type)}
                              {playlist.type}
                            </Badge>
                          </div>

                          {/* Playlist info */}
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-sm truncate">{playlist.name}</h4>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Image className="h-3 w-3" />
                                    {playlist.itemCount} items
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {playlist.lastModified}
                                  </span>
                                </div>
                              </div>

                              {/* Playlist Menu */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-52 bg-popover border shadow-lg z-50"
                                >
                                  <DropdownMenuItem onClick={() => handlePlayPlaylist(playlist)}>
                                    <Play className="h-4 w-4 mr-2" /> Play Playlist
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setPreviewPlaylist(playlist);
                                      setPreviewIndex(0);
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" /> Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => setDetailsPlaylist(playlist)}>
                                    <Info className="h-4 w-4 mr-2" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEditingPlaylist(playlist)}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit Playlist
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDuplicatePlaylist(playlist, group.id)}
                                  >
                                    <Copy className="h-4 w-4 mr-2" /> Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setMovePlaylist({ playlist, fromGroup: group })}
                                  >
                                    <Move className="h-4 w-4 mr-2" /> Move to Group
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleExportPlaylist(playlist)}>
                                    <Download className="h-4 w-4 mr-2" /> Export
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSharePlaylist(playlist)}>
                                    <Share2 className="h-4 w-4 mr-2" /> Share Link
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setDeletingPlaylist(playlist)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {/* Add playlist card */}
                      <Card className="overflow-hidden border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group/add">
                        <div className="aspect-video flex items-center justify-center bg-muted/30 group-hover/add:bg-muted/50 transition-colors">
                          <div className="text-center">
                            <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <span className="text-sm text-muted-foreground">Add Playlist</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {/* ===== PREVIEW DIALOG ===== */}
      <Dialog open={!!previewPlaylist} onOpenChange={() => setPreviewPlaylist(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview: {previewPlaylist?.name}
            </DialogTitle>
            <DialogDescription>
              Browse through all {previewPlaylist?.itemCount} items in this playlist
            </DialogDescription>
          </DialogHeader>

          {previewPlaylist && (
            <div className="space-y-4">
              {/* Main preview area */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <img
                  src={previewPlaylist.assets[previewIndex]?.thumbnail || '/placeholder.svg'}
                  alt={previewPlaylist.assets[previewIndex]?.name}
                  className="w-full h-full object-contain"
                />

                {/* Asset info overlay */}
                <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg">
                  <span className="font-medium">{previewPlaylist.assets[previewIndex]?.name}</span>
                  <span className="mx-2">·</span>
                  <span className="text-white/70">
                    {previewIndex + 1} / {previewPlaylist.assets.length}
                  </span>
                </div>

                {/* Type indicator */}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="gap-1">
                    {previewPlaylist.assets[previewIndex]?.type === 'video' ? (
                      <>
                        <Video className="h-3 w-3" /> Video
                      </>
                    ) : (
                      <>
                        <Image className="h-3 w-3" /> Image
                      </>
                    )}
                  </Badge>
                </div>

                {/* Navigation controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 rounded-full px-4 py-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                    onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                    disabled={previewIndex === 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10"
                    onClick={() => handlePlayPlaylist(previewPlaylist)}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                    onClick={() =>
                      setPreviewIndex(Math.min(previewPlaylist.assets.length - 1, previewIndex + 1))
                    }
                    disabled={previewIndex === previewPlaylist.assets.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail strip */}
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {previewPlaylist.assets.map((asset, i) => (
                    <div
                      key={asset.id}
                      className={`relative shrink-0 w-24 h-16 rounded overflow-hidden border-2 cursor-pointer transition-all ${
                        i === previewIndex
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-transparent hover:border-primary/50'
                      }`}
                      onClick={() => setPreviewIndex(i)}
                    >
                      <img
                        src={asset.thumbnail}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                      {asset.type === 'video' && (
                        <div className="absolute bottom-1 right-1">
                          <Video className="h-3 w-3 text-white drop-shadow" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Asset details */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">Resolution</span>
                  <p className="font-medium mt-0.5">
                    {previewPlaylist.assets[previewIndex]?.resolution}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">Duration</span>
                  <p className="font-medium mt-0.5">
                    {previewPlaylist.assets[previewIndex]?.duration}s
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">File Size</span>
                  <p className="font-medium mt-0.5">
                    {previewPlaylist.assets[previewIndex]?.fileSize}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <span className="text-muted-foreground">Added</span>
                  <p className="font-medium mt-0.5">
                    {previewPlaylist.assets[previewIndex]?.addedAt}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewPlaylist(null)}>
              Close
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                if (previewPlaylist) {
                  handlePlayPlaylist(previewPlaylist);
                  setPreviewPlaylist(null);
                }
              }}
            >
              <Play className="h-4 w-4" />
              Start Playback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== FULL PLAYER DIALOG ===== */}
      <Dialog open={!!playerPlaylist} onOpenChange={() => handleClosePlayer()}>
        <DialogContent
          className={`${isFullscreen ? 'max-w-full h-full m-0 rounded-none' : 'max-w-6xl'} p-0`}
        >
          {playerPlaylist && currentAsset && (
            <div className={`flex flex-col ${isFullscreen ? 'h-screen' : ''}`}>
              {/* Player Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleClosePlayer}>
                    <X className="h-5 w-5" />
                  </Button>
                  <div>
                    <h3 className="font-semibold">{playerPlaylist.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Playing: {currentAsset.name} ({currentAssetIndex + 1}/
                      {playerPlaylist.assets.length})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Main Player Area */}
              <div className={`relative bg-black flex-1 ${isFullscreen ? '' : 'aspect-video'}`}>
                <img
                  src={currentAsset.thumbnail}
                  alt={currentAsset.name}
                  className="w-full h-full object-contain"
                />

                {/* Progress bar overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Player Controls */}
              <div className="px-4 py-4 border-t bg-background space-y-4">
                {/* Progress slider */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-10">
                    {Math.floor((progress / 100) * transitionDuration)}s
                  </span>
                  <Slider
                    value={[progress]}
                    onValueChange={([val]) => setProgress(val)}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-10">{transitionDuration}s</span>
                </div>

                {/* Main controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isShuffled ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setIsShuffled(!isShuffled)}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentAssetIndex(0);
                        setProgress(0);
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handlePrevious}>
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button size="icon" className="h-12 w-12" onClick={handlePauseResume}>
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNext}>
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={isLooping ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setIsLooping(!isLooping)}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-64 bg-popover border shadow-lg z-50 p-4 space-y-4"
                      >
                        <div className="space-y-2">
                          <Label className="text-sm">Transition Duration</Label>
                          <div className="flex items-center gap-3">
                            <Slider
                              value={[transitionDuration]}
                              onValueChange={([val]) => setTransitionDuration(val)}
                              min={1}
                              max={30}
                              step={1}
                            />
                            <span className="text-sm w-8">{transitionDuration}s</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Auto-advance</Label>
                          <Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Loop playlist</Label>
                          <Switch checked={isLooping} onCheckedChange={setIsLooping} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Shuffle</Label>
                          <Switch checked={isShuffled} onCheckedChange={setIsShuffled} />
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Volume control */}
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={([val]) => {
                      setVolume(val);
                      setIsMuted(val === 0);
                    }}
                    max={100}
                    step={1}
                    className="w-32"
                  />
                </div>

                {/* Thumbnail strip */}
                <ScrollArea className="w-full">
                  <div className="flex gap-2 pt-2">
                    {playerPlaylist.assets.map((asset, i) => (
                      <div
                        key={asset.id}
                        className={`shrink-0 w-20 h-12 rounded overflow-hidden border-2 cursor-pointer transition-all ${
                          i === currentAssetIndex
                            ? 'border-primary ring-2 ring-primary/30'
                            : 'border-transparent hover:border-primary/50'
                        }`}
                        onClick={() => {
                          setCurrentAssetIndex(i);
                          setProgress(0);
                        }}
                      >
                        <img
                          src={asset.thumbnail}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== PLAYLIST DETAILS DIALOG ===== */}
      <Dialog open={!!detailsPlaylist} onOpenChange={() => setDetailsPlaylist(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Playlist Details
            </DialogTitle>
          </DialogHeader>

          {detailsPlaylist && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="assets">Assets ({detailsPlaylist.itemCount})</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="flex gap-6">
                  <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden shrink-0">
                    <img
                      src={detailsPlaylist.thumbnail}
                      alt={detailsPlaylist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p className="font-medium">{detailsPlaylist.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Type</Label>
                        <p className="font-medium capitalize">{detailsPlaylist.type}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Duration</Label>
                        <p className="font-medium">{detailsPlaylist.duration}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Items</Label>
                        <p className="font-medium">{detailsPlaylist.itemCount}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Last Modified</Label>
                        <p className="font-medium">{detailsPlaylist.lastModified}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="assets" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {detailsPlaylist.assets.map((asset, i) => (
                      <div
                        key={asset.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        <span className="text-sm text-muted-foreground w-6">{i + 1}</span>
                        <div className="w-16 h-10 bg-muted rounded overflow-hidden shrink-0">
                          <img
                            src={asset.thumbnail}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {asset.resolution} · {asset.fileSize}
                          </p>
                        </div>
                        <Badge
                          variant={asset.type === 'video' ? 'default' : 'secondary'}
                          className="shrink-0"
                        >
                          {asset.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{asset.duration}s</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-loop</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically restart when playlist ends
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Shuffle mode</Label>
                      <p className="text-sm text-muted-foreground">Play items in random order</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label>Default transition duration</Label>
                    <div className="flex items-center gap-3">
                      <Slider defaultValue={[5]} min={1} max={30} step={1} className="flex-1" />
                      <span className="text-sm w-12">5 sec</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsPlaylist(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setEditingPlaylist(detailsPlaylist);
                setDetailsPlaylist(null);
              }}
            >
              Edit Playlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== APPDIALOG: CREATE GROUP ===== */}
      <AppDialog
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
        title="Create Playlist Group"
        description="Group playlists together for better organization"
        cancelLabel="Cancel"
        primaryAction={{
          label: 'Create Group',
          onClick: () => {
            if (!createGroupName.trim()) {
              toast.error('Missing group name', { description: 'Please enter a group name.' });
              return;
            }

            const newGroup: PlaylistGroup = {
              id: Date.now(),
              name: createGroupName.trim(),
              description: createGroupDesc.trim(),
              createdAt: new Date().toLocaleDateString('sr-RS'),
              color: 'hsl(var(--chart-5))',
              playlists: [],
            };

            setGroups((prev) => [newGroup, ...prev]);
            setCreateGroupOpen(false);
            setCreateGroupName('');
            setCreateGroupDesc('');

            toast.success('Group created', {
              description: `"${newGroup.name}" created successfully.`,
            });
          },
          disabled: !canCreateGroup,
        }}
        onRequestClose={() => {
          setCreateGroupName('');
          setCreateGroupDesc('');
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={createGroupName}
              onChange={(e) => setCreateGroupName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="groupDesc">Description</Label>
            <Input
              id="groupDesc"
              value={createGroupDesc}
              onChange={(e) => setCreateGroupDesc(e.target.value)}
            />
          </div>
        </div>
      </AppDialog>

      {/* ===== APPDIALOG: EDIT GROUP ===== */}
      <AppDialog
        open={!!editingGroup}
        onOpenChange={(open) => {
          if (!open) setEditingGroup(null);
        }}
        title="Edit Group"
        description={
          editingGroup ? `Update details for "${editingGroup.name}".` : 'Update group details.'
        }
        cancelLabel="Cancel"
        primaryAction={{
          label: 'Save Changes',
          onClick: () => {
            if (!editingGroup) return;

            if (!editGroupName.trim()) {
              toast.error('Missing group name', { description: 'Please enter a group name.' });
              return;
            }

            setGroups((prev) =>
              prev.map((g) =>
                g.id === editingGroup.id
                  ? { ...g, name: editGroupName.trim(), description: editGroupDesc.trim() }
                  : g,
              ),
            );

            toast.success('Group updated', { description: 'Changes have been saved.' });
            setEditingGroup(null);
          },
          disabled: !canEditGroup,
        }}
        onRequestClose={() => {
          setEditingGroup(null);
          setEditGroupName('');
          setEditGroupDesc('');
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Group Name</Label>
            <Input value={editGroupName} onChange={(e) => setEditGroupName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={editGroupDesc} onChange={(e) => setEditGroupDesc(e.target.value)} />
          </div>
        </div>
      </AppDialog>

      {/* ===== APPDIALOG: DELETE GROUP ===== */}
      <AppDialog
        open={!!deletingGroup}
        onOpenChange={(open) => {
          if (!open) setDeletingGroup(null);
        }}
        title="Delete Group"
        description={
          deletingGroup
            ? `Are you sure you want to delete "${deletingGroup.name}"? This will also delete all ${deletingGroup.playlists.length} playlists inside.`
            : 'Are you sure you want to delete this group?'
        }
        cancelLabel="Cancel"
        primaryAction={{
          label: 'Delete Group',
          variant: 'destructive',
          onClick: () => {
            if (!deletingGroup) return;

            const group = deletingGroup;
            setGroups((prev) => prev.filter((g) => g.id !== group.id));
            setDeletingGroup(null);

            toast.success('Group deleted', { description: `"${group.name}" has been deleted.` });
          },
        }}
        children={undefined}
      />

      {/* ===== APPDIALOG: EDIT PLAYLIST ===== */}
      <AppDialog
        open={!!editingPlaylist}
        onOpenChange={(open) => {
          if (!open) setEditingPlaylist(null);
        }}
        title="Edit Playlist"
        description={
          editingPlaylist
            ? `Update details for "${editingPlaylist.name}".`
            : 'Update playlist details.'
        }
        cancelLabel="Cancel"
        primaryAction={{
          label: 'Save Changes',
          onClick: () => {
            if (!editingPlaylist) return;

            if (!editPlaylistName.trim()) {
              toast.error('Missing playlist name', {
                description: 'Please enter a playlist name.',
              });
              return;
            }

            const playlistId = editingPlaylist.id;

            setGroups((prev) =>
              prev.map((g) => ({
                ...g,
                playlists: g.playlists.map((p) =>
                  p.id === playlistId ? { ...p, name: editPlaylistName.trim() } : p,
                ),
              })),
            );

            toast.success('Playlist updated', { description: 'Changes have been saved.' });
            setEditingPlaylist(null);
          },
          disabled: !canEditPlaylist,
        }}
        onRequestClose={() => {
          setEditingPlaylist(null);
          setEditPlaylistName('');
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Playlist Name</Label>
            <Input value={editPlaylistName} onChange={(e) => setEditPlaylistName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 bg-muted rounded overflow-hidden">
                <img
                  src={editingPlaylist?.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info('Not wired yet', {
                    description: 'Thumbnail change is mock in this demo.',
                  })
                }
              >
                Change Thumbnail
              </Button>
            </div>
          </div>
        </div>
      </AppDialog>

      {/* ===== APPDIALOG: DELETE PLAYLIST ===== */}
      <AppDialog
        open={!!deletingPlaylist}
        onOpenChange={(open) => {
          if (!open) setDeletingPlaylist(null);
        }}
        title="Delete Playlist"
        description={
          deletingPlaylist
            ? `Are you sure you want to delete "${deletingPlaylist.name}"? This action cannot be undone.`
            : 'Are you sure you want to delete this playlist?'
        }
        cancelLabel="Cancel"
        primaryAction={{
          label: 'Delete Playlist',
          variant: 'destructive',
          onClick: () => {
            if (!deletingPlaylist) return;

            const playlist = deletingPlaylist;

            setGroups((prev) =>
              prev.map((g) => ({
                ...g,
                playlists: g.playlists.filter((p) => p.id !== playlist.id),
              })),
            );

            setDeletingPlaylist(null);

            toast.success('Playlist deleted', {
              description: `"${playlist.name}" has been deleted.`,
            });
          },
        }}
        children={undefined}
      />

      {/* ===== MOVE PLAYLIST DIALOG (kept as shadcn Dialog) ===== */}
      <Dialog open={!!movePlaylist} onOpenChange={() => setMovePlaylist(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Playlist</DialogTitle>
            <DialogDescription>
              Select a group to move "{movePlaylist?.playlist.name}" to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {groups
              .filter((g) => g.id !== movePlaylist?.fromGroup.id)
              .map((group) => (
                <div
                  key={group.id}
                  className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    movePlaylist &&
                    handleMovePlaylist(movePlaylist.playlist, movePlaylist.fromGroup.id, group.id)
                  }
                >
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: group.color }} />
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {group.playlists.length} playlists
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMovePlaylist(null)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaylistGroupsContent;

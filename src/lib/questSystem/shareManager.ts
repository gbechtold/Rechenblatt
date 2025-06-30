import { ChallengeLink, PlayerProgress, Quest } from './types';
import { ShortUrlService } from './shortUrlService';
import { useTranslation } from 'next-i18next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://rechenblatt.fly.dev';

export class ShareManager {
  private static instance: ShareManager;

  private constructor() {}

  public static getInstance(): ShareManager {
    if (!ShareManager.instance) {
      ShareManager.instance = new ShareManager();
    }
    return ShareManager.instance;
  }

  public createChallengeLink(
    progress: PlayerProgress,
    quest: Quest,
    stats: {
      score: number;
      combo: number;
      time: number;
      perfect: boolean;
    }
  ): string {
    const challengeData: ChallengeLink = {
      version: '1.0',
      challenger: {
        name: 'Player', // Can be customized later
        playerId: progress.playerId
      },
      quest: {
        theme: quest.theme,
        number: quest.number,
        title: quest.title
      },
      stats,
      message: this.generateChallengeMessage(quest, stats),
      createdAt: new Date()
    };

    // Use short URL service
    const shortUrlService = ShortUrlService.getInstance();
    const shortCode = shortUrlService.createChallengeCode(challengeData);
    return `${BASE_URL}/c/${shortCode}`;
  }

  private encodeChallenge(data: ChallengeLink): string {
    try {
      // Compress the data to make shorter URLs
      const json = JSON.stringify(data);
      const base64 = btoa(encodeURIComponent(json));
      // Replace URL-unsafe characters
      return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    } catch (error) {
      console.error('Failed to encode challenge:', error);
      return '';
    }
  }

  public decodeChallenge(encoded: string): ChallengeLink | null {
    try {
      // Add back padding if needed
      const padding = '='.repeat((4 - encoded.length % 4) % 4);
      const base64 = encoded
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        + padding;
      
      const json = decodeURIComponent(atob(base64));
      return JSON.parse(json);
    } catch (error) {
      console.error('Failed to decode challenge:', error);
      return null;
    }
  }

  private generateChallengeMessage(quest: Quest, stats: { score: number; combo: number; perfect: boolean }): string {
    const messages = {
      en: [
        `I scored ${stats.score} points in ${quest.title.en}! Can you beat me? 🎯`,
        `Just achieved a ${stats.combo}x combo! Think you can do better? 🔥`,
        stats.perfect ? `Perfect run in ${quest.title.en}! No mistakes! 🌟` : `Conquered ${quest.title.en}! Your turn! 🚀`,
        `My best combo: ${stats.combo}x | Score: ${stats.score} | Can you top this? 💪`
      ],
      de: [
        `Ich habe ${stats.score} Punkte in ${quest.title.de} erreicht! Kannst du mich schlagen? 🎯`,
        `Gerade eine ${stats.combo}x Combo erreicht! Schaffst du mehr? 🔥`,
        stats.perfect ? `Perfekter Durchlauf in ${quest.title.de}! Keine Fehler! 🌟` : `${quest.title.de} gemeistert! Du bist dran! 🚀`,
        `Meine beste Combo: ${stats.combo}x | Punkte: ${stats.score} | Schaffst du das? 💪`
      ]
    };

    const lang = 'en'; // This should come from i18n context
    return messages[lang][Math.floor(Math.random() * messages[lang].length)];
  }

  public shareVia(platform: 'whatsapp' | 'instagram' | 'twitter' | 'copy', link: string, message: string): void {
    const fullMessage = `${message}\n\n${link}`;

    switch (platform) {
      case 'whatsapp':
        this.shareWhatsApp(fullMessage);
        break;
      case 'instagram':
        this.shareInstagram(link, message);
        break;
      case 'twitter':
        this.shareTwitter(fullMessage);
        break;
      case 'copy':
        this.copyToClipboard(fullMessage);
        break;
    }
  }

  private shareWhatsApp(message: string): void {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  private shareTwitter(message: string): void {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  private shareInstagram(link: string, message: string): void {
    // Instagram doesn't support direct link sharing, so we copy the link
    // and show instructions to share in story/post
    this.copyToClipboard(link);
    
    // Show a notification to the user
    if (typeof window !== 'undefined') {
      alert('Link copied! Share it in your Instagram story or post caption.');
    }
  }

  private copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        // Show success notification
        console.log('Copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        console.log('Copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      
      document.body.removeChild(textArea);
    }
  }

  public generateShareCard(
    quest: Quest,
    stats: { score: number; combo: number; time: number },
    theme: string
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return canvas;

    // Background gradient based on theme
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    // Theme-specific gradients
    const themeGradients = {
      space: ['#1e3a8a', '#7c3aed', '#000000'],
      dino: ['#059669', '#84cc16', '#14532d'],
      medieval: ['#991b1b', '#6b7280', '#450a0a'],
      ocean: ['#0891b2', '#0e7490', '#083344'],
      circus: ['#dc2626', '#facc15', '#7c2d12']
    };

    const colors = themeGradients[quest.theme] || themeGradients.space;
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add content
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    // Title
    ctx.font = 'bold 80px Arial';
    ctx.fillText('RECHENBLATT', canvas.width / 2, 200);
    
    // Quest name
    ctx.font = '60px Arial';
    ctx.fillText(quest.title.en, canvas.width / 2, 400);
    
    // Stats
    ctx.font = 'bold 120px Arial';
    ctx.fillText(`${stats.score}`, canvas.width / 2, 600);
    ctx.font = '40px Arial';
    ctx.fillText('POINTS', canvas.width / 2, 680);
    
    // Combo
    ctx.font = '60px Arial';
    ctx.fillText(`Best Combo: ${stats.combo}x 🔥`, canvas.width / 2, 850);
    
    // Time
    const minutes = Math.floor(stats.time / 60);
    const seconds = stats.time % 60;
    ctx.fillText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, canvas.width / 2, 950);
    
    // Challenge text
    ctx.font = 'bold 50px Arial';
    ctx.fillText('CAN YOU BEAT THIS?', canvas.width / 2, 1400);
    
    // URL
    ctx.font = '40px Arial';
    ctx.fillText('rechenblatt.fly.dev', canvas.width / 2, 1800);

    return canvas;
  }

  public async downloadShareCard(
    quest: Quest,
    stats: { score: number; combo: number; time: number },
    theme: string
  ): Promise<void> {
    const canvas = this.generateShareCard(quest, stats, theme);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rechenblatt-${quest.theme}-challenge.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }
}
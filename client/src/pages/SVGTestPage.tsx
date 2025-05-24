/**
 * SVG Icon Test Page
 * 
 * Visual comparison between Lucide React icons and their SVG replacements.
 * Used for reviewing icon accuracy before implementing full replacement.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle,
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Circle, Clock,
  Coins, Copy, Database, Dot, ExternalLink, Eye, EyeOff, Flame,
  Gem, GripVertical, Info, Loader2, MoreHorizontal, Palette,
  PanelLeft, Search, Shield, Star, Wallet, X
} from "lucide-react";

import {
  AlertCircleIcon, AlertTriangleIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, CheckCircleIcon,
  ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, CircleIcon, ClockIcon,
  CoinsIcon, CopyIcon, DatabaseIcon, DotIcon, ExternalLinkIcon, EyeIcon, EyeOffIcon, FlameIcon,
  GemIcon, GripVerticalIcon, InfoIcon, Loader2Icon, MoreHorizontalIcon, PaletteIcon,
  PanelLeftIcon, SearchIcon, ShieldIcon, StarIcon, WalletIcon, XIcon
} from "@/components/SVGIcons";

interface IconComparisonRow {
  name: string;
  lucideIcon: any;
  svgIcon: any;
}

const iconList: IconComparisonRow[] = [
  { name: "AlertCircle", lucideIcon: AlertCircle, svgIcon: AlertCircleIcon },
  { name: "AlertTriangle", lucideIcon: AlertTriangle, svgIcon: AlertTriangleIcon },
  { name: "ArrowLeft", lucideIcon: ArrowLeft, svgIcon: ArrowLeftIcon },
  { name: "ArrowRight", lucideIcon: ArrowRight, svgIcon: ArrowRightIcon },
  { name: "Check", lucideIcon: Check, svgIcon: CheckIcon },
  { name: "CheckCircle", lucideIcon: CheckCircle, svgIcon: CheckCircleIcon },
  { name: "ChevronDown", lucideIcon: ChevronDown, svgIcon: ChevronDownIcon },
  { name: "ChevronLeft", lucideIcon: ChevronLeft, svgIcon: ChevronLeftIcon },
  { name: "ChevronRight", lucideIcon: ChevronRight, svgIcon: ChevronRightIcon },
  { name: "ChevronUp", lucideIcon: ChevronUp, svgIcon: ChevronUpIcon },
  { name: "Circle", lucideIcon: Circle, svgIcon: CircleIcon },
  { name: "Clock", lucideIcon: Clock, svgIcon: ClockIcon },
  { name: "Coins", lucideIcon: Coins, svgIcon: CoinsIcon },
  { name: "Copy", lucideIcon: Copy, svgIcon: CopyIcon },
  { name: "Database", lucideIcon: Database, svgIcon: DatabaseIcon },
  { name: "Dot", lucideIcon: Dot, svgIcon: DotIcon },
  { name: "ExternalLink", lucideIcon: ExternalLink, svgIcon: ExternalLinkIcon },
  { name: "Eye", lucideIcon: Eye, svgIcon: EyeIcon },
  { name: "EyeOff", lucideIcon: EyeOff, svgIcon: EyeOffIcon },
  { name: "Flame", lucideIcon: Flame, svgIcon: FlameIcon },
  { name: "Gem", lucideIcon: Gem, svgIcon: GemIcon },
  { name: "GripVertical", lucideIcon: GripVertical, svgIcon: GripVerticalIcon },
  { name: "Info", lucideIcon: Info, svgIcon: InfoIcon },
  { name: "Loader2", lucideIcon: Loader2, svgIcon: Loader2Icon },
  { name: "MoreHorizontal", lucideIcon: MoreHorizontal, svgIcon: MoreHorizontalIcon },
  { name: "Palette", lucideIcon: Palette, svgIcon: PaletteIcon },
  { name: "PanelLeft", lucideIcon: PanelLeft, svgIcon: PanelLeftIcon },
  { name: "Search", lucideIcon: Search, svgIcon: SearchIcon },
  { name: "Shield", lucideIcon: Shield, svgIcon: ShieldIcon },
  { name: "Star", lucideIcon: Star, svgIcon: StarIcon },
  { name: "Wallet", lucideIcon: Wallet, svgIcon: WalletIcon },
  { name: "X", lucideIcon: X, svgIcon: XIcon },
];

export default function SVGTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            SVG Icon Comparison Test
          </h1>
          <p className="text-lg text-slate-300 mb-2">
            Visual comparison between Lucide React icons and SVG replacements
          </p>
          <Badge variant="secondary" className="text-sm">
            {iconList.length} icons total
          </Badge>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">Icon Comparison Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-4 text-slate-300 font-semibold">Icon Name</th>
                    <th className="text-center py-4 px-4 text-slate-300 font-semibold">Lucide Original</th>
                    <th className="text-center py-4 px-4 text-slate-300 font-semibold">SVG Replacement</th>
                  </tr>
                </thead>
                <tbody>
                  {iconList.map((icon, index) => {
                    const LucideIcon = icon.lucideIcon;
                    const SVGIcon = icon.svgIcon;
                    
                    return (
                      <tr 
                        key={icon.name} 
                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                          index % 2 === 0 ? 'bg-slate-800/30' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <code className="text-blue-300 bg-slate-900/50 px-2 py-1 rounded text-sm">
                            {icon.name}
                          </code>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center">
                            <LucideIcon className="text-slate-300" size={24} />
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center">
                            <SVGIcon className="text-slate-300" size={24} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Review each SVG icon for visual accuracy compared to the Lucide original.
            <br />
            Report any icons that need visual adjustments before full implementation.
          </p>
        </div>
      </div>
    </div>
  );
}
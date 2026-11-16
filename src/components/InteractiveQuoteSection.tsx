import React, { useState, useEffect, useRef, useId } from 'react';
import quotesData from '../data/quotes.json';
import { useLanguage } from '../contexts/LanguageContext';
import ViewportVideo from './ViewportVideo';
import {
  encodeQuoteToken,
  decodeQuoteToken,
  verifyAdminPasscode
} from '../utils/quoteToken';

interface SavedAdminQuote {
  id: string;
  clientName: string;
  businessName?: string;
  quoteNumber: string;
  url: string;
  createdAt: string;
}

const ADMIN_STORAGE_KEY = 'tym_admin_saved_quotes_v1';
const ADMIN_SESSION_KEY = 'tym_admin_unlocked';
const DEFAULT_DEPOSIT_PERCENT = 30;
const DEFAULT_BALANCE_PERCENT = 100 - DEFAULT_DEPOSIT_PERCENT;

interface ClientProfile {
  id: string;
  quoteNumber: string;
  date: string;
  clientName: string;
  businessName?: string;
  address: string;
  phone: string;
  depositPercent: number;
  validityDays: number;
}

interface QuoteSelections {
  staticMenuPages: number;
  animatedMenuScreens: number;
  decalPanels: number;
  decalDesignCount: number;
  tvComboSelected: boolean;
  tvSize?: '55' | '65';
  tvExtraClips: number;
  basicClips: number;
  influencerClips: number;
}

const ZERO_SELECTIONS: QuoteSelections = {
  staticMenuPages: 0,
  animatedMenuScreens: 0,
  decalPanels: 0,
  decalDesignCount: 0,
  tvComboSelected: false,
  tvSize: '55',
  tvExtraClips: 0,
  basicClips: 0,
  influencerClips: 0
};

const copyText = {
  vi: {
    badge: 'TYM PRODUCTION • BÁO GIÁ TƯƠNG TÁC & TRỰC QUAN',
    brandSubtitle: 'Dịch vụ thiết kế & sản xuất hình ảnh chuyên nghiệp',
    quoteTitle: 'BẢNG BÁO GIÁ DỊCH VỤ',
    dateLabel: 'Ngày:',
    quoteNumLabel: 'Số BG:',
    recipientHeader: 'KÍNH GỬI:',
    addressLabel: 'Địa chỉ:',
    phoneLabel: 'Số điện thoại:',
    introText:
      'TYM Production trân trọng gửi đến Quý khách hàng bảng báo giá tương tác kèm sản phẩm minh họa thực tế. Quý khách có thể bấm xem trực tiếp video mẫu và tùy chỉnh số lượng từng hạng mục để ước tính ngân sách:',
    standardClientName: 'Bảng Giá Chuẩn Tham Khảo',
    standardRecipientTag: 'DỊCH VỤ THIẾT KẾ & SẢN XUẤT HÌNH ẢNH',
    btnCopyEstimate: '🔗 Copy Dự Toán Đang Chọn',
    adminBadge: '🔑 TYM ADMIN CONSOLE',
    adminUnlockBtn: '🔑 Mở Khóa Quản Trị',
    adminLockBtn: '🔒 Khóa Admin',
    adminPinTitle: 'Xác Thực Quản Trị Viên TYM Production',
    adminPinDesc: 'Nhập mã PIN quản trị để tạo và quản lý link báo giá riêng tư cho từng khách hàng.',
    adminPinPlaceholder: 'Nhập mã PIN quản trị',
    adminPinWrong: 'Mã PIN không đúng. Vui lòng thử lại.',
    adminUnlockSubmit: 'Mở Khóa',
    adminSavedTitle: 'Khách hàng đã tạo (chỉ lưu trên thiết bị này):',
    adminIncludeSelections: 'Đính kèm các mục đang chọn bên dưới (tắt để khách tự chọn từ 0)',
    adminResetStandard: 'Về Bảng Chuẩn',
    createNewClientBtn: '+ Tạo Link Cho Khách Mới',
    scrollToPortfolioBtn: 'Xem thêm Portfolio bên dưới ↓',
    expandMediaBtn: '⤢ Phóng to xem rõ',
    expandAudioVideoBtn: '⤢ Phóng to (có âm thanh)',
    closeModalBtn: 'Đóng',
    item1Title: '1. Thiết kế & Đồng bộ Menu',
    item1Subtitle: 'Menu Tĩnh (In ấn / TV) & Menu Động 4K (Animation từng món)',
    item1TabAnimated: '▶ Xem Video Menu Động ($350)',
    item1TabStatic: '🖼 Xem Mẫu Menu Tĩnh ($200)',
    item1Bullets: [
      'Phân chia, sắp xếp bố cục món ăn/giá khoa học; thiết kế dựa trên bộ nhận diện và mẫu (template) có sẵn của tiệm.',
      'Menu tĩnh ($200.00 / mặt): Áp dụng cho 1 mặt hiển thị màn hình (16:9) hoặc 1 mặt giấy khổ Letter / A4; bàn giao file chuẩn in ấn hoặc hiển thị TV sắc nét.',
      'Menu động ($350.00 / mặt màn hình): Thiết kế bảng menu trình chiếu TV hoàn chỉnh (đầy đủ danh sách nhiều món ăn, giá bán và khu vực ưu đãi nổi bật), làm hiệu ứng chuyển động (animation) riêng cho từng món ăn.',
      'Lưu ý: Nội dung chữ (tên món, giá) do tiệm cung cấp; bao gồm tối đa 02 lần chỉnh sửa; chưa bao gồm chi phí in ấn/ép nhựa (đối với menu giấy).'
    ],
    item1CtrlStatic: 'Số mặt Menu Tĩnh ($200/mặt)',
    item1CtrlAnimated: 'Số mặt Menu Động ($350/mặt)',
    item2Title: '2. Gói Combo: Lắp đặt TV & Sản xuất Video',
    item2Subtitle: 'Digital Signage Mặt Tiền (Chỉ nhận lắp TV theo gói Combo trọn gói)',
    item2TabRealTV: '▶ TV 55" thực tế tại tiệm',
    item2TabSampleClip: '▶ Mẫu Clip 20s trong Loop',
    item2Bullets: [
      'Áp dụng theo gói Combo trọn gói (không nhận thi công lắp đặt TV riêng lẻ).',
      'Khảo sát vị trí, thi công lắp đặt 1 TV 55 inch tại cửa kính mặt tiền, đi dây gọn gàng và cài đặt chế độ phát lặp tự động (auto-loop).',
      'Tùy chọn nâng cấp TV 65 inch: Nếu Quý khách chọn lắp đặt TV 65 inch, chi phí thi công lắp đặt cộng thêm +$150.00 extra (tổng gói Combo TV 65 inch là $600.00).',
      'Sản xuất chuỗi video quảng cáo chạy lặp (tổng thời lượng 1 phút, gồm tối đa 3 clip ngắn riêng lẻ, mỗi clip 20 giây).',
      'Nội dung mỗi clip 20 giây: Tập trung giới thiệu 01 món ăn/thức uống hoặc 01 thông điệp ưu đãi nổi bật với chuyển động đơn giản, không bao gồm thiết kế danh sách nhiều món & bảng giá chi tiết như Menu Động.',
      'Tùy chọn thêm (Extra clip): Làm thêm clip với chi phí $100.00 / clip (20 giây/clip, không giới hạn số lượng).',
      'Lưu ý: Chưa bao gồm chi phí mua TV, khung đỡ/giá treo TV (và dây kéo/ổ cắm điện mới nếu vị trí lắp chưa có sẵn nguồn điện).'
    ],
    item2CtrlCombo: 'Chọn Gói Combo Lắp TV + 3 Clip Loop',
    item2Opt55: 'TV 55" ($450)',
    item2Opt65: 'TV 65" (+$150 = $600)',
    item2CtrlExtra: 'Số lượng Extra Clip làm thêm ($100/clip 20s)',
    item3Title: '3. Sáng tạo Clip Cơ bản',
    item3Subtitle: 'Video quảng cáo ngắn 20 giây cho TV hoặc Mạng xã hội (Reels / TikTok)',
    item3Bullets: [
      'Sản xuất 01 clip quảng cáo ngắn (20 giây) tập trung làm nổi bật 01 món ăn/sản phẩm hoặc 01 chương trình khuyến mãi (lên ý tưởng ngắn, hiệu ứng chuyển động cơ bản trên 1 chủ thể, tiêu đề ngắn & nhạc nền).',
      'Thực hiện dựa trên hình ảnh/video gốc do tiệm cung cấp hoặc hình ảnh món ăn được xử lý nâng cấp sắc nét.',
      'Bàn giao 01 định dạng khung hình theo nhu cầu: khổ ngang (16:9) cho TV hoặc khổ dọc (9:16) đăng mạng xã hội (Facebook, Instagram Reels, TikTok).',
      'Lưu ý: Bao gồm tối đa 02 lần chỉnh sửa chi tiết chữ/nhịp điệu.'
    ],
    item3CtrlClips: 'Số lượng Clip Cơ bản 20s ($100/clip)',
    item4Title: '4. Sáng tạo Video Quảng Cáo Influencer / Review Trải Nghiệm',
    item4Subtitle: 'Clip Reels / TikTok có người review thử món thực tế tại tiệm (30–35 giây / clip)',
    item4Bullets: [
      'Xây dựng kịch bản & lời thoại tự nhiên theo phong cách UGC / Influencer review: cảnh mở hộp, cầm sản phẩm cận cảnh và ăn thử trực tiếp trên khung hình kèm biểu cảm chân thực.',
      'Cắt dựng nhịp nhanh bắt mắt chuẩn mạng xã hội, lồng ghép thanh theo dõi các phần nổi bật (hook mở đầu, khoảnh khắc ăn thử ASMR, đánh giá 10/10) trong vùng hiển thị an toàn của Reels / TikTok.',
      'Thiết kế đồ họa chữ động thu hút: tiêu đề lớn đầu clip, tag nhấn mạnh thành phần đặc trưng của món, phụ đề song ngữ đồng bộ khớp lời thoại cùng hiệu ứng sticker & âm thanh ASMR + nhạc nền.',
      'Chèn thanh thông tin chốt đơn & kêu gọi ghé quán (tên tiệm, giá món, địa chỉ, số điện thoại, giờ mở cửa). Bàn giao file dọc Full HD 9:16, thời lượng chuẩn 30–35 giây/clip (kèm tối đa 02 lần chỉnh sửa; video bên cạnh là mẫu 20s minh họa phong cách thực tế).'
    ],
    item4CtrlClips: 'Số lượng Video Influencer / Review 30–35s ($200/clip)',
    item5Title: '5. Thi công Decal Kính',
    item5Subtitle: 'Đo đạc & thi công dán hoàn thiện tại mặt bằng (Tối thiểu 02 mặt kính)',
    item5Bullets: [
      'Đo đạc kích thước thực tế tại mặt bằng, vệ sinh bề mặt kính và thi công dán decal kính mặt tiền hoàn thiện (phẳng đẹp, thẩm mỹ).',
      'Áp dụng tối thiểu: Nhận thi công từ 02 mặt kính trở lên (đơn thi công tối thiểu $200.00).',
      'Lưu ý: Đơn giá $100.00/mặt kính chỉ bao gồm công đo đạc và thi công dán; chưa bao gồm chi phí in ấn vật tư decal.',
      'Chi phí thiết kế decal (nếu tiệm chưa có file sẵn): Tính theo đơn giá thiết kế đồ họa tĩnh tương đương Mục 1 ($200.00 / mặt thiết kế).'
    ],
    item5CtrlPanels: 'Số mặt kính thi công ($100/mặt, tối thiểu 2)',
    item5CtrlDesign: 'Số mặt cần Thiết kế Decal mới ($200/mặt)',
    row1aTitle: '1A. Thiết kế Menu Tĩnh (In ấn Letter/A4 hoặc TV)',
    row1bTitle: '1B. Thiết kế Menu Động 4K (Animation từng món)',
    row3Title: '3. Sáng tạo Video Clip Cơ bản (20 giây/clip)',
    row4Title: '4. Video Quảng Cáo Influencer / Review Trải Nghiệm (30–35 giây/clip)',
    row5Title: '5. Thi công Decal Kính Mặt Tiền (Tối thiểu 2 mặt)',
    summaryCaption: 'Bảng Tổng Hợp & Dự Toán Chi Phí Dịch Vụ',
    colService: 'Hạng Mục Dịch Vụ',
    colUnitPrice: 'Đơn Giá Chuẩn',
    colQty: 'Số Lượng Đang Chọn',
    colSubtotal: 'Thành Tiền',
    totalSelectedLabel: 'TỔNG CHI PHÍ DỰ KIẾN (THEO MỤC ĐÃ CHỌN)',
    depositLabel: `Tạm ứng khi xác nhận đơn hàng (${DEFAULT_DEPOSIT_PERCENT}%)`,
    balanceLabel: `Thanh toán khi nghiệm thu / bàn giao (${DEFAULT_BALANCE_PERCENT}%)`,
    termsTitle: 'Điều Khoản & Lưu Ý Chung',
    termValidity: 'Hiệu lực báo giá: Có giá trị trong vòng 30 ngày kể từ ngày phát hành.',
    termPayment: `Thanh toán: Tạm ứng ${DEFAULT_DEPOSIT_PERCENT}% khi xác nhận đơn hàng, thanh toán ${DEFAULT_BALANCE_PERCENT}% còn lại sau khi nghiệm thu/bàn giao.`,
    termExclusions: 'Chi phí vật tư & thiết bị: Báo giá chưa bao gồm chi phí in ấn (menu giấy, decal kính) và chưa bao gồm chi phí mua TV, khung treo TV.',
    btnPrintPdf: '🖨️ Xuất / Tải Bản PDF Báo Giá',
    btnSendSms: '💬 Chốt Báo Giá Qua SMS',
    btnSendEmail: '✉️ Gửi Xác Nhận Qua Email',
    btnCopyLink: '🔗 Copy Link Báo Giá Này',
    copiedLinkMsg: '✓ Đã copy link báo giá!',
    generatorTitle: 'Tạo Nhanh Link Báo Giá Cho Khách Hàng Mới',
    generatorDesc: 'Điền thông tin khách hàng mới bên dưới. Hệ thống sẽ tạo ngay 1 đường link riêng hiển thị tên, địa chỉ, SĐT và các hạng mục bạn đang chọn.',
    fieldClientName: 'Tên khách hàng (VD: Chị Lan / Anh Minh)',
    fieldBusiness: 'Tên tiệm / Nhà hàng (Tùy chọn)',
    fieldAddress: 'Địa chỉ tiệm',
    fieldPhone: 'Số điện thoại',
    fieldQuoteNum: 'Mã số báo giá',
    btnApplyAndCopy: 'Áp Dụng & Copy Link Gửi Khách',
    yesSelected: 'Đã chọn (1 gói)',
    notSelected: 'Chưa chọn'
  },
  en: {
    badge: 'TYM PRODUCTION • INTERACTIVE VISUAL QUOTATION',
    brandSubtitle: 'Professional Design & Visual Production Services',
    quoteTitle: 'SERVICE QUOTATION',
    dateLabel: 'Date:',
    quoteNumLabel: 'Quote #:',
    recipientHeader: 'PREPARED FOR:',
    addressLabel: 'Address:',
    phoneLabel: 'Phone:',
    introText:
      'TYM Production is pleased to present this interactive visual quotation with live work samples. Preview our video demos directly below and adjust quantities to estimate your project budget:',
    standardClientName: 'Standard Service Rate Card',
    standardRecipientTag: 'CREATIVE DESIGN & VISUAL PRODUCTION',
    btnCopyEstimate: '🔗 Copy This Estimate',
    adminBadge: '🔑 TYM ADMIN CONSOLE',
    adminUnlockBtn: '🔑 Unlock Studio Admin',
    adminLockBtn: '🔒 Lock Admin',
    adminPinTitle: 'TYM Production Admin Access',
    adminPinDesc: 'Enter your studio passcode to generate private, single-client quotation links.',
    adminPinPlaceholder: 'Enter studio passcode',
    adminPinWrong: 'Incorrect passcode. Please try again.',
    adminUnlockSubmit: 'Unlock',
    adminSavedTitle: 'Private links created on this device:',
    adminIncludeSelections: 'Pre-fill with selected items below (leave unchecked to start at 0)',
    adminResetStandard: 'Reset to Standard',
    createNewClientBtn: '+ Create Private Client Link',
    scrollToPortfolioBtn: 'Explore Full Portfolio Below ↓',
    expandMediaBtn: '⤢ Fullscreen Preview',
    expandAudioVideoBtn: '⤢ Fullscreen (with Audio)',
    closeModalBtn: 'Close',
    item1Title: '1. Menu Design & Synchronization',
    item1Subtitle: 'Static Menu (Print / TV) & 4K Animated Digital Menu Board',
    item1TabAnimated: '▶ Watch Animated Menu ($350)',
    item1TabStatic: '🖼 View Static Menu ($200)',
    item1Bullets: [
      'Structured layout of dishes and pricing based on your restaurant’s brand identity and existing templates.',
      'Static Menu ($200.00 / page): Applies to 1 screen display (16:9) or 1 Letter / A4 print page; delivered in print-ready or crisp TV resolution.',
      'Animated Menu ($350.00 / screen): Full digital menu board displaying multiple dishes, pricing, and special offer highlights, with custom animation for each individual dish.',
      'Note: Text content (item names, prices) provided by client; includes up to 02 revisions; excludes printing/lamination costs.'
    ],
    item1CtrlStatic: 'Static Menu Pages ($200/page)',
    item1CtrlAnimated: 'Animated Menu Screens ($350/screen)',
    item2Title: '2. Combo Package: TV Installation & Video Production',
    item2Subtitle: 'Storefront Digital Signage (TV installation available exclusively as a Combo)',
    item2TabRealTV: '▶ Real 55" TV Installed On-Site',
    item2TabSampleClip: '▶ Sample 20s Loop Clip',
    item2Bullets: [
      'Available exclusively as a complete Combo Package (standalone TV installation is not offered).',
      'Site survey and installation of 1x 55-inch TV at the storefront window, clean cable routing, and auto-loop playback setup.',
      '65-inch TV Upgrade Option: If selecting a 65-inch TV, an additional +$150.00 installation fee applies ($600.00 total for the 65" TV Combo).',
      'Production of a 1-minute promotional video loop (up to 3 individual short clips, 20 seconds each).',
      'Each 20s clip: Highlights 01 featured dish/drink or 01 promotional message with clean motion effects (does not include multi-item full menu board layouts like Item 1).',
      'Add-on (Extra clip): $100.00 / clip (20 seconds/clip, unlimited quantity).',
      'Note: Excludes the cost of purchasing the TV, TV mount/bracket, and new electrical outlet wiring if not already available near the mounting spot.'
    ],
    item2CtrlCombo: 'Select TV Installation + 3-Clip Loop Combo',
    item2Opt55: '55" TV ($450)',
    item2Opt65: '65" TV (+$150 = $600)',
    item2CtrlExtra: 'Extra 20s Clips ($100/clip)',
    item3Title: '3. Basic Promotional Video Clip',
    item3Subtitle: '20-second spotlight video clip for TV Display or Social Media (Reels / TikTok)',
    item3Bullets: [
      'Production of 01 short promotional clip (20 seconds) spotlighting 01 dish/product or 01 promotion (concept, single-subject motion animation, title overlay & background music).',
      'Created from client-provided photos/footage or AI-enhanced high-resolution food imagery.',
      'Delivered in 01 aspect ratio of choice: Landscape (16:9) for TV or Vertical (9:16) for Social Media (Instagram Reels, TikTok, Facebook).',
      'Note: Includes up to 02 revisions for text/timing details.'
    ],
    item3CtrlClips: 'Basic 20s Video Clips ($100/clip)',
    item4Title: '4. Influencer / UGC Tasting Review Ad Video',
    item4Subtitle: 'Social Reels / TikTok ad featuring on-camera product tasting & review (30–35 sec / clip)',
    item4Bullets: [
      'Scripted UGC / Influencer tasting production: attention-grabbing opening hook, unboxing, close-up food showcase, and authentic on-camera reaction & first bite.',
      'Fast-paced Reels / TikTok editing with top safe-zone story progress pills (hook, texture showcase, ASMR crunch bite, 10/10 verdict) engineered for high watch time.',
      'Animated motion-graphics typography: bold dish headline & price callouts, floating ingredient tags, synchronized bilingual subtitles, expressive effects, ASMR audio cues, and background soundtrack.',
      'Branded storefront closing CTA bar (shop name, dish price, street address, phone, opening hours). Delivered in 9:16 Full HD, 30–35 seconds/clip (includes up to 02 revisions; preview shows a 20s format demo).'
    ],
    item4CtrlClips: 'Influencer / Review Ad Clips 30–35s ($200/clip)',
    item5Title: '5. Storefront Window Decal Installation',
    item5Subtitle: 'On-site measurement, surface prep & installation (Minimum 02 glass panels)',
    item5Bullets: [
      'On-site measurement, glass surface cleaning, and professional storefront decal installation.',
      'Minimum order: Minimum 02 glass panels required ($200.00 minimum installation fee).',
      'Note: $100.00/panel covers measurement and installation labor only; excludes decal printing material costs.',
      'Decal graphic design fee (if artwork is not provided): Charged at the Static Design rate from Item 1 ($200.00 / design layout).'
    ],
    item5CtrlPanels: 'Glass Panels to Install ($100/panel, min 2)',
    item5CtrlDesign: 'New Decal Design Layouts ($200/layout)',
    row1aTitle: '1A. Static Menu Design (Letter/A4 Print or TV)',
    row1bTitle: '1B. Animated Digital Menu 4K (Per-Dish Animation)',
    row3Title: '3. Basic Promotional Video Clip (20s / clip)',
    row4Title: '4. Influencer / UGC Tasting Review Video (30–35s / clip)',
    row5Title: '5. Storefront Window Decal Installation (Min. 2 panels)',
    summaryCaption: 'Quotation Summary & Live Budget Estimator',
    colService: 'Service Item',
    colUnitPrice: 'Standard Rate',
    colQty: 'Selected Qty',
    colSubtotal: 'Subtotal',
    totalSelectedLabel: 'ESTIMATED TOTAL (SELECTED ITEMS)',
    depositLabel: `Deposit upon order confirmation (${DEFAULT_DEPOSIT_PERCENT}%)`,
    balanceLabel: `Balance upon completion & handover (${DEFAULT_BALANCE_PERCENT}%)`,
    termsTitle: 'Terms & General Notes',
    termValidity: 'Quote Validity: Valid for 30 days from the issue date.',
    termPayment: `Payment Terms: ${DEFAULT_DEPOSIT_PERCENT}% deposit upon confirmation, ${DEFAULT_BALANCE_PERCENT}% balance upon completion/handover.`,
    termExclusions: 'Hardware & Printing Exclusions: Prices exclude physical printing costs (paper menus, vinyl decals) and exclude TV & TV mount hardware costs.',
    btnPrintPdf: '🖨️ Export / Print PDF Quote',
    btnSendSms: '💬 Confirm Quote via SMS',
    btnSendEmail: '✉️ Confirm via Email',
    btnCopyLink: '🔗 Copy Quote Link',
    copiedLinkMsg: '✓ Quote link copied!',
    generatorTitle: 'Quick Quote Link Generator for New Clients',
    generatorDesc: 'Enter the new client details below to generate a personalized quote link with their name, address, phone number, and current item selections.',
    fieldClientName: 'Client Name (e.g. Ms. Lan / Mr. Minh)',
    fieldBusiness: 'Business / Restaurant Name (Optional)',
    fieldAddress: 'Business Address',
    fieldPhone: 'Phone Number',
    fieldQuoteNum: 'Quote Number',
    btnApplyAndCopy: 'Apply & Copy Client Quote Link',
    yesSelected: 'Selected (1 pkg)',
    notSelected: 'Not selected'
  },
  fr: {
    badge: 'TYM PRODUCTION • DEVIS VISUEL INTERACTIF',
    brandSubtitle: 'Services professionnels de design et production visuelle',
    quoteTitle: 'DEVIS DE SERVICES',
    dateLabel: 'Date :',
    quoteNumLabel: 'N° Devis :',
    recipientHeader: 'PRÉPARÉ POUR :',
    addressLabel: 'Adresse :',
    phoneLabel: 'Téléphone :',
    introText:
      'TYM Production a le plaisir de vous présenter ce devis interactif accompagné d’exemples réels. Visionnez nos démos vidéo ci-dessous et ajustez les quantités pour estimer votre budget :',
    standardClientName: 'Grille Tarifaire Standard',
    standardRecipientTag: 'CONCEPTION & PRODUCTION VISUELLE',
    btnCopyEstimate: '🔗 Copier cette Estimation',
    adminBadge: '🔑 CONSOLE ADMIN TYM',
    adminUnlockBtn: '🔑 Déverrouiller Admin',
    adminLockBtn: '🔒 Verrouiller',
    adminPinTitle: 'Accès Administrateur TYM Production',
    adminPinDesc: 'Entrez votre code secret pour créer des liens de devis privés par client.',
    adminPinPlaceholder: 'Code secret',
    adminPinWrong: 'Code incorrect. Veuillez réessayer.',
    adminUnlockSubmit: 'Déverrouiller',
    adminSavedTitle: 'Liens privés enregistrés sur cet appareil :',
    adminIncludeSelections: 'Pré-remplir avec les quantités actuelles (décoché = départ à 0)',
    adminResetStandard: 'Grille Standard',
    createNewClientBtn: '+ Créer un Lien Privé Client',
    scrollToPortfolioBtn: 'Voir le Portfolio complet ci-dessous ↓',
    expandMediaBtn: '⤢ Plein écran',
    expandAudioVideoBtn: '⤢ Plein écran (avec son)',
    closeModalBtn: 'Fermer',
    item1Title: '1. Conception & Synchronisation de Menu',
    item1Subtitle: 'Menu Statique (Impression / TV) & Menu Dynamique 4K (Animation par plat)',
    item1TabAnimated: '▶ Voir Menu Animé (350 $)',
    item1TabStatic: '🖼 Voir Menu Statique (200 $)',
    item1Bullets: [
      'Mise en page structurée des plats et tarifs selon l’identité visuelle et le gabarit existant du restaurant.',
      'Menu statique (200,00 $ / face) : Pour 1 écran (16:9) ou 1 page format Lettre / A4 ; fichier haute résolution prêt pour impression ou TV.',
      'Menu animé (350,00 $ / écran) : Tableau de menu TV complet (liste de plats, prix et encart promotionnel) avec animation individuelle pour chaque plat.',
      'Note : Textes (noms, prix) fournis par le client ; inclut jusqu’à 02 révisions ; frais d’impression/plastification non inclus.'
    ],
    item1CtrlStatic: 'Faces de Menu Statique (200 $/face)',
    item1CtrlAnimated: 'Écrans de Menu Animé (350 $/écran)',
    item2Title: '2. Forfait Combo : Installation TV & Production Vidéo',
    item2Subtitle: 'Affichage Numérique Vitrine (Installation TV offerte uniquement en forfait Combo)',
    item2TabRealTV: '▶ TV 55" installée en vitrine',
    item2TabSampleClip: '▶ Exemple de Clip 20s',
    item2Bullets: [
      'Offert exclusivement en forfait Combo complet (aucune installation de TV seule).',
      'Installation d’un téléviseur 55 pouces en vitrine, passage des câbles et configuration de la lecture en boucle (auto-loop).',
      'Option TV 65 pouces : Pour l’installation d’un téléviseur 65 pouces, un supplément de pose de +150,00 $ s’applique (600,00 $ au total pour le Combo TV 65").',
      'Production d’une boucle vidéo promotionnelle d’une minute (jusqu’à 3 clips individuels de 20 secondes chacun).',
      'Contenu par clip de 20s : Met en valeur 01 plat/boisson ou 01 promotion avec animation simple (n’inclut pas une grille complète de menu comme l’article 1).',
      'Option supplémentaire (Extra clip) : 100,00 $ / clip (20 secondes/clip, sans limite).',
      'Note : N’inclut pas l’achat du téléviseur, du support mural/plafond ni l’installation d’une nouvelle prise électrique.'
    ],
    item2CtrlCombo: 'Forfait Combo Pose TV + 3 Clips',
    item2Opt55: 'TV 55" (450 $)',
    item2Opt65: 'TV 65" (+150 $ = 600 $)',
    item2CtrlExtra: 'Clips supplémentaires 20s (100 $/clip)',
    item3Title: '3. Création de Clip Vidéo de Base',
    item3Subtitle: 'Clip promotionnel de 20 secondes pour TV ou Réseaux Sociaux (Reels / TikTok)',
    item3Bullets: [
      'Production d’un clip court (20 secondes) mettant en vedette 01 plat/produit ou 01 promotion (concept, animation de base sur 1 sujet, titrage et musique).',
      'Réalisé à partir des photos/vidéos du restaurant ou d’images culinaires optimisées haute définition.',
      'Livré en 01 format au choix : Horizontal (16:9) pour TV ou Vertical (9:16) pour Instagram Reels, TikTok, Facebook.',
      'Note : Inclut jusqu’à 02 révisions de détails.'
    ],
    item3CtrlClips: 'Nombre de Clips de Base 20s (100 $/clip)',
    item4Title: '4. Vidéo Publicitaire Influenceur / Dégustation Produit',
    item4Subtitle: 'Clip Reels / TikTok avec dégustation & réaction authentique face caméra (30–35 s / clip)',
    item4Bullets: [
      'Scénario et tournage style UGC / Influenceur : accroche visuelle dès les premières secondes, ouverture du plat, gros plans gourmands et réaction authentique à la dégustation.',
      'Montage dynamique optimisé pour Reels / TikTok avec barre de progression en zone sécurisée (accroche, texture, bouchée ASMR, note 10/10) pour maximiser la rétention.',
      'Habillage graphique animé : titres d’accroche et prix, étiquettes flottantes des ingrédients, sous-titres bilingues synchronisés, effets visuels, bruitages ASMR et musique rythmée.',
      'Bandeau final complet du commerce (nom, tarif du plat, adresse, téléphone, heures d’ouverture). Format vertical 9:16 Full HD, durée standard 30–35 secondes/clip (jusqu’à 02 révisions incluses ; l’aperçu montre une démo de 20s).'
    ],
    item4CtrlClips: 'Nombre de Vidéos Influenceur 30–35s (200 $/clip)',
    item5Title: '5. Pose de Décalque sur Vitrine',
    item5Subtitle: 'Prise de mesures, nettoyage et pose sur vitrine (Minimum 02 panneaux)',
    item5Bullets: [
      'Prise de mesures sur place, nettoyage des vitres et pose professionnelle de décalque en façade.',
      'Minimum requis : Pose à partir de 02 panneaux vitrés (forfait minimum de pose de 200,00 $).',
      'Note : Le tarif de 100,00 $/vitre couvre uniquement la main-d’œuvre de pose ; frais d’impression du vinyle non inclus.',
      'Frais de création graphique (si aucun fichier prêt à imprimer) : Tarif équivalent au design statique de l’article 1 (200,00 $ / maquette).'
    ],
    item5CtrlPanels: 'Vitres à poser (100 $/vitre, min 2)',
    item5CtrlDesign: 'Nouvelles maquettes de décalque (200 $/maquette)',
    row1aTitle: '1A. Conception Menu Statique (Impression Lettre/A4 ou TV)',
    row1bTitle: '1B. Conception Menu Animé 4K (Animation par plat)',
    row3Title: '3. Création de Clip Vidéo de Base (20s / clip)',
    row4Title: '4. Vidéo Publicitaire Influenceur / Dégustation (30–35s / clip)',
    row5Title: '5. Pose de Décalque sur Vitrine (Min. 2 vitres)',
    summaryCaption: 'Récapitulatif du Devis & Calculateur de Budget',
    colService: 'Service',
    colUnitPrice: 'Tarif Unitaire',
    colQty: 'Quantité Choisie',
    colSubtotal: 'Sous-total',
    totalSelectedLabel: 'TOTAL ESTIMÉ (SELON SÉLECTION)',
    depositLabel: `Acompte à la confirmation (${DEFAULT_DEPOSIT_PERCENT} %)`,
    balanceLabel: `Solde à la livraison / réception (${DEFAULT_BALANCE_PERCENT} %)`,
    termsTitle: 'Conditions & Notes Générales',
    termValidity: 'Validité du devis : Valable 30 jours à compter de la date d’émission.',
    termPayment: `Modalités de paiement : Acompte de ${DEFAULT_DEPOSIT_PERCENT} % à la confirmation, solde de ${DEFAULT_BALANCE_PERCENT} % à la livraison.`,
    termExclusions: 'Exclusions : Les tarifs n’incluent pas les frais d’impression (menus, vinyles) ni l’achat du téléviseur et de son support.',
    btnPrintPdf: '🖨️ Exporter / Imprimer en PDF',
    btnSendSms: '💬 Confirmer par SMS',
    btnSendEmail: '✉️ Confirmer par Email',
    btnCopyLink: '🔗 Copier le Lien du Devis',
    copiedLinkMsg: '✓ Lien copié !',
    generatorTitle: 'Générateur Rapide de Devis Client',
    generatorDesc: 'Saisissez les coordonnées du nouveau client pour générer un lien personnalisé avec son nom, son adresse et la sélection actuelle.',
    fieldClientName: 'Nom du client (ex: Mme Lan)',
    fieldBusiness: 'Nom du commerce / restaurant (Optionnel)',
    fieldAddress: 'Adresse du commerce',
    fieldPhone: 'Numéro de téléphone',
    fieldQuoteNum: 'Numéro de devis',
    btnApplyAndCopy: 'Appliquer & Copier le Lien Client',
    yesSelected: 'Inclus (1 forfait)',
    notSelected: 'Non sélectionné'
  }
};

export default function InteractiveQuoteSection({
  isDedicatedClientMode = false,
  onScrollToPortfolio
}: {
  isDedicatedClientMode?: boolean;
  onScrollToPortfolio?: () => void;
}) {
  const { language } = useLanguage();
  const c = copyText[language] || copyText.vi;

  // Determine initial quote strictly from signed ?q= token or fall back to public Standard Rate Card (ZERO client PII in bundle)
  const buildStandardProfile = (langCode: string = language): ClientProfile => {
    const stdTitle =
      langCode === 'en'
        ? 'Standard Service Rate Card'
        : langCode === 'fr'
          ? 'Grille Tarifaire Standard'
          : 'Bảng Giá Chuẩn Tham Khảo';
    return {
      id: 'standard',
      quoteNumber: 'TYM-2026-STD',
      date: '16/11/2026',
      clientName: stdTitle,
      businessName: '',
      address: 'Montréal & Rive-Sud, QC, Canada',
      phone: '',
      depositPercent: DEFAULT_DEPOSIT_PERCENT,
      validityDays: 30
    };
  };

  const getInitialClientFromUrl = (): {
    profile: ClientProfile;
    selections: QuoteSelections;
    activeToken: string | null;
    hasAdminParam: boolean;
  } => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('q');
      const hasAdminParam = params.get('admin') === '1';

      if (token) {
        const decoded = decodeQuoteToken(token);
        if (decoded) {
          const p = decoded.profile;
          const s = decoded.selections;
          return {
            activeToken: token,
            hasAdminParam,
            profile: {
              id: 'client',
              quoteNumber: p.quoteNumber,
              date: p.date,
              clientName: p.clientName,
              businessName: p.businessName || '',
              address: p.address || '',
              phone: p.phone || '',
              depositPercent: DEFAULT_DEPOSIT_PERCENT,
              validityDays: 30
            },
            selections: {
              ...ZERO_SELECTIONS,
              staticMenuPages: Number(s?.staticMenuPages ?? 0),
              animatedMenuScreens: Number(s?.animatedMenuScreens ?? 0),
              decalPanels: Number(s?.decalPanels ?? 0),
              decalDesignCount: Number(s?.decalDesignCount ?? 0),
              tvComboSelected: Boolean(s?.tvComboSelected),
              tvSize: s?.tvSize === '65' ? '65' : '55',
              tvExtraClips: Number(s?.tvExtraClips ?? 0),
              basicClips: Number(s?.basicClips ?? 0),
              influencerClips: Number(s?.influencerClips ?? 0)
            }
          };
        }
      }

      // Allow anonymous numeric estimate links only (?smenu=...&amenu=...), keeping zero client identity
      return {
        activeToken: null,
        hasAdminParam,
        profile: buildStandardProfile(),
        selections: {
          staticMenuPages: Number(params.get('smenu') ?? 0),
          animatedMenuScreens: Number(params.get('amenu') ?? 0),
          decalPanels: Number(params.get('decal') ?? 0),
          decalDesignCount: Number(params.get('ddesign') ?? 0),
          tvComboSelected: params.get('tv') === '1',
          tvSize: params.get('tvsize') === '65' ? '65' : '55',
          tvExtraClips: Number(params.get('extra') ?? 0),
          basicClips: Number(params.get('clip') ?? 0),
          influencerClips: Number(params.get('uclip') ?? 0)
        }
      };
    }

    return {
      activeToken: null,
      hasAdminParam: false,
      profile: buildStandardProfile(),
      selections: { ...ZERO_SELECTIONS }
    };
  };

  const initialData = getInitialClientFromUrl();
  const [clientProfile, setClientProfile] = useState<ClientProfile>(initialData.profile);
  const [selections, setSelections] = useState<QuoteSelections>(initialData.selections);
  const [activeToken, setActiveToken] = useState<string | null>(initialData.activeToken);
  const hasAdminParam = initialData.hasAdminParam;

  // Admin state: strictly locked unless unlocked in this browser session via valid passcode
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
  });
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);
  const [savedAdminQuotes, setSavedAdminQuotes] = useState<SavedAdminQuote[]>(() => {
    if (typeof window === 'undefined' || sessionStorage.getItem(ADMIN_SESSION_KEY) !== '1') {
      return [];
    }
    try {
      const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [includeCurrentSelections, setIncludeCurrentSelections] = useState(false);

  // Keep standard card localized when switching VI / EN / FR on generic view
  useEffect(() => {
    setClientProfile((prev) => (prev.id === 'standard' ? buildStandardProfile(language) : prev));
  }, [language]);

  // Media preview tabs inside Card 1 and Card 2 (TV Combo)
  const [item1MediaTab, setItem1MediaTab] = useState<'animated' | 'static'>('animated');
  const [tvMediaTab, setTvMediaTab] = useState<'realtv' | 'sampleclip'>('realtv');

  // Copy link notification state
  const [copiedLink, setCopiedLink] = useState(false);

  // Native <dialog> refs & IDs (following light-dismiss-a-dialog guidance)
  const previewDialogRef = useRef<HTMLDialogElement>(null);
  const generatorDialogRef = useRef<HTMLDialogElement>(null);
  const pinDialogRef = useRef<HTMLDialogElement>(null);
  const previewDialogTitleId = useId();
  const generatorDialogTitleId = useId();
  const pinDialogTitleId = useId();
  const tableCaptionId = useId();

  const [previewMedia, setPreviewMedia] = useState<{
    title: string;
    type: 'video' | 'image';
    src: string;
  } | null>(null);

  // New client form state inside generator modal
  const [newClientForm, setNewClientForm] = useState({
    clientName: '',
    businessName: '',
    address: '',
    phone: '',
    quoteNumber: 'TYM-2611-002'
  });

  // Fallback for browsers without native dialog.closedBy support (e.g. Safari)
  useEffect(() => {
    const dialogs = [
      previewDialogRef.current,
      generatorDialogRef.current,
      pinDialogRef.current
    ].filter(Boolean) as HTMLDialogElement[];

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handlers = dialogs.map((dialog) => {
        const handler = (event: MouseEvent) => {
          if (event.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          const isDialogContent =
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width;
          if (isDialogContent) return;
          dialog.close();
        };
        dialog.addEventListener('click', handler);
        return { dialog, handler };
      });

      return () => {
        handlers.forEach(({ dialog, handler }) => dialog.removeEventListener('click', handler));
      };
    }
  }, [isAdminUnlocked]);

  const handleResetToStandard = () => {
    setActiveToken(null);
    setClientProfile(buildStandardProfile());
    setSelections({ ...ZERO_SELECTIONS });
  };

  const openMediaModal = (title: string, type: 'video' | 'image', src: string) => {
    setPreviewMedia({ title, type, src });
    previewDialogRef.current?.showModal();
  };

  const openPinModal = () => {
    setAdminPinInput('');
    setAdminPinError(false);
    pinDialogRef.current?.showModal();
  };

  const openGeneratorModal = () => {
    if (!isAdminUnlocked) {
      openPinModal();
      return;
    }
    generatorDialogRef.current?.showModal();
  };

  const handleUnlockAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAdminPasscode(adminPinInput)) {
      setAdminPinError(true);
      return;
    }
    sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    setIsAdminUnlocked(true);
    setAdminPinError(false);
    setAdminPinInput('');
    try {
      const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
      setSavedAdminQuotes(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedAdminQuotes([]);
    }
    pinDialogRef.current?.close();
  };

  const handleLockAdmin = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminUnlocked(false);
    setSavedAdminQuotes([]);
    if (clientProfile.id === 'client' && !activeToken) {
      handleResetToStandard();
    }
  };

  const deleteSavedAdminQuote = (id: string) => {
    const next = savedAdminQuotes.filter((q) => q.id !== id);
    setSavedAdminQuotes(next);
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota
    }
  };

  const loadSavedAdminQuote = (saved: SavedAdminQuote) => {
    try {
      const urlObj = new URL(saved.url);
      const tok = urlObj.searchParams.get('q');
      if (!tok) return;
      const decoded = decodeQuoteToken(tok);
      if (!decoded) return;
      setActiveToken(tok);
      setClientProfile({
        id: 'client',
        quoteNumber: decoded.profile.quoteNumber,
        date: decoded.profile.date,
        clientName: decoded.profile.clientName,
        businessName: decoded.profile.businessName || '',
        address: decoded.profile.address || '',
        phone: decoded.profile.phone || '',
        depositPercent: DEFAULT_DEPOSIT_PERCENT,
        validityDays: 30
      });
      setSelections({
        ...ZERO_SELECTIONS,
        ...(decoded.selections || {})
      });
    } catch {
      // ignore malformed URL
    }
  };

  // Pricing calculations (ordered 1..5 to match quotation cards & summary table)
  const rates = quotesData.pricing;
  const staticMenuSubtotal = selections.staticMenuPages * rates.staticMenuPerPage;
  const animatedMenuSubtotal = selections.animatedMenuScreens * rates.animatedMenuPerScreen;
  const item1Subtotal = staticMenuSubtotal + animatedMenuSubtotal;

  const tvSizeExtra =
    selections.tvComboSelected && selections.tvSize === '65' ? rates.tv65InchExtra : 0;
  const tvBaseSubtotal = selections.tvComboSelected ? rates.tvComboPackage + tvSizeExtra : 0;
  const tvExtraSubtotal = selections.tvExtraClips * rates.tvExtraClip;
  const item2Subtotal = tvBaseSubtotal + tvExtraSubtotal;

  const item3Subtotal = selections.basicClips * rates.basicClip20s;
  const item4Subtotal = selections.influencerClips * rates.influencerClipPerVideo;

  const decalInstallSubtotal = selections.decalPanels * rates.decalPerPanel;
  const decalDesignSubtotal = selections.decalDesignCount * rates.decalDesignPerLayout;
  const item5Subtotal = decalInstallSubtotal + decalDesignSubtotal;

  const grandTotal =
    item1Subtotal + item2Subtotal + item3Subtotal + item4Subtotal + item5Subtotal;
  const depositAmount = Math.round(grandTotal * (clientProfile.depositPercent / 100) * 100) / 100;
  const balanceAmount = Math.round((grandTotal - depositAmount) * 100) / 100;

  // Handle Decal Panels stepper (0 or >= 2 panels due to 2-panel minimum rule)
  const adjustDecalPanels = (delta: number) => {
    setSelections((prev) => {
      const current = prev.decalPanels;
      let next = current + delta;
      if (delta > 0 && current === 0) next = 2; // Jump straight to minimum 2 panels
      if (delta < 0 && current === 2) next = 0; // Drop back to 0 if deselected below 2
      return { ...prev, decalPanels: Math.max(0, next) };
    });
  };

  // Build shareable URL (signed opaque ?q= token for clients, or numeric-only budget link for anonymous standard view)
  const buildShareableUrl = (tokenOverride?: string | null) => {
    const url = new URL(window.location.origin + window.location.pathname);
    const tok = tokenOverride !== undefined ? tokenOverride : activeToken;
    if (tok) {
      url.searchParams.set('q', tok);
      return url.toString();
    }
    url.searchParams.set('smenu', String(selections.staticMenuPages));
    url.searchParams.set('amenu', String(selections.animatedMenuScreens));
    url.searchParams.set('tv', selections.tvComboSelected ? '1' : '0');
    url.searchParams.set('tvsize', selections.tvSize === '65' ? '65' : '55');
    url.searchParams.set('extra', String(selections.tvExtraClips));
    url.searchParams.set('clip', String(selections.basicClips));
    url.searchParams.set('uclip', String(selections.influencerClips));
    url.searchParams.set('decal', String(selections.decalPanels));
    url.searchParams.set('ddesign', String(selections.decalDesignCount));
    url.hash = encodeURIComponent('section-Pricing & Services');
    return url.toString();
  };

  const handleCopyQuoteLink = (tokenOverride?: string | null) => {
    const link = buildShareableUrl(tokenOverride);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCreateNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminUnlocked || !newClientForm.clientName.trim()) return;
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const qnum = newClientForm.quoteNumber.trim() || 'TYM-2611-002';
    const createdProfile: ClientProfile = {
      id: 'client',
      quoteNumber: qnum,
      date: dateStr,
      clientName: newClientForm.clientName.trim(),
      businessName: newClientForm.businessName.trim(),
      address: newClientForm.address.trim() || 'Québec, Canada',
      phone: newClientForm.phone.trim(),
      depositPercent: DEFAULT_DEPOSIT_PERCENT,
      validityDays: 30
    };
    const token = encodeQuoteToken(
      {
        quoteNumber: createdProfile.quoteNumber,
        date: createdProfile.date,
        clientName: createdProfile.clientName,
        businessName: createdProfile.businessName,
        address: createdProfile.address,
        phone: createdProfile.phone
      },
      includeCurrentSelections ? { ...selections } : undefined
    );
    const nextSelections = includeCurrentSelections ? { ...selections } : { ...ZERO_SELECTIONS };
    setActiveToken(token);
    setClientProfile(createdProfile);
    setSelections(nextSelections);

    const shareUrl = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(token)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);

    const newEntry: SavedAdminQuote = {
      id: `${Date.now()}`,
      clientName: createdProfile.clientName,
      businessName: createdProfile.businessName,
      quoteNumber: createdProfile.quoteNumber,
      url: shareUrl,
      createdAt: dateStr
    };
    const updatedList = [newEntry, ...savedAdminQuotes.filter((q) => q.quoteNumber !== qnum)];
    setSavedAdminQuotes(updatedList);
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updatedList));
    } catch {
      // ignore storage quota
    }
    generatorDialogRef.current?.close();
  };

  // Pre-filled SMS / Email body for quick client confirmation
  const buildConfirmationBody = () => {
    const lines = [
      `TYM Production - Xác nhận Báo Giá (${clientProfile.quoteNumber})`,
      `Khách hàng: ${clientProfile.clientName}`,
      `Tổng dự kiến: $${grandTotal.toFixed(2)} (Tạm ứng ${clientProfile.depositPercent}%: $${depositAmount.toFixed(2)})`
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  // Media paths
  const mediaMenuAnimated = '/Media/quote-showcase/menu-dong-demo.mp4';
  const mediaMenuStatic = '/Media/quote-showcase/menu-tinh-demo.png';
  const mediaDecalStorefront = '/Media/quote-showcase/decal-kinh-demo.jpg';
  const mediaRealTV = '/Media/quote-showcase/real-tv-demo.mp4';
  const mediaSampleLoopClip = '/Media/quote-showcase/sample-loop-clip.mp4';
  const mediaBasicClip = '/Media/quote-showcase/clip-co-ban-demo.mp4';
  const mediaInfluencerClip = '/Media/quote-showcase/clip-influencer-demo.mp4';

  return (
    <section id="section-Pricing & Services" className="interactive-quote-section container">
      {/* Top Toolbar: Public visitors see ONLY badge & copy estimate; Admin controls remain strictly hidden unless ?admin=1 unlocked */}
      <div className="quote-top-toolbar no-print">
        <div className="quote-mode-pills">
          <span className="quote-badge-label">{c.badge}</span>
          {hasAdminParam && !isAdminUnlocked && (
            <button type="button" className="quote-action-pill" onClick={openPinModal}>
              {c.adminUnlockBtn}
            </button>
          )}
        </div>

        <div className="quote-toolbar-actions">
          <button type="button" className="quote-action-pill" onClick={() => handleCopyQuoteLink()}>
            {copiedLink
              ? c.copiedLinkMsg
              : clientProfile.id === 'client'
                ? c.btnCopyLink
                : c.btnCopyEstimate}
          </button>
          {isDedicatedClientMode && onScrollToPortfolio && (
            <button
              type="button"
              className="quote-action-pill highlight"
              onClick={onScrollToPortfolio}
            >
              {c.scrollToPortfolioBtn}
            </button>
          )}
        </div>
      </div>

      {/* Private Studio Admin Bar (only rendered in unlocked browser session on admin's device) */}
      {isAdminUnlocked && (
        <div className="quote-admin-strip no-print">
          <div className="quote-admin-header-row">
            <span className="quote-admin-badge">{c.adminBadge}</span>
            <div className="quote-admin-actions">
              <button
                type="button"
                className="quote-switch-btn create-new-btn"
                onClick={openGeneratorModal}
              >
                {c.createNewClientBtn}
              </button>
              {clientProfile.id === 'client' && (
                <button
                  type="button"
                  className="quote-switch-btn"
                  onClick={handleResetToStandard}
                >
                  {c.adminResetStandard}
                </button>
              )}
              <button type="button" className="quote-switch-btn" onClick={handleLockAdmin}>
                {c.adminLockBtn}
              </button>
            </div>
          </div>

          {savedAdminQuotes.length > 0 && (
            <div className="quote-admin-saved-row">
              <span className="admin-saved-label">{c.adminSavedTitle}</span>
              <div className="admin-saved-chips">
                {savedAdminQuotes.map((sq) => (
                  <div key={sq.id} className="admin-saved-chip">
                    <button
                      type="button"
                      className="admin-chip-load"
                      onClick={() => loadSavedAdminQuote(sq)}
                    >
                      {sq.clientName} ({sq.quoteNumber})
                    </button>
                    <button
                      type="button"
                      className="admin-chip-copy"
                      onClick={() => {
                        navigator.clipboard.writeText(sq.url);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      title={c.btnCopyLink}
                    >
                      🔗
                    </button>
                    <button
                      type="button"
                      className="admin-chip-del"
                      onClick={() => deleteSavedAdminQuote(sq.id)}
                      aria-label={`Remove ${sq.clientName}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Quotation Document Container */}
      <div className="quote-document-card glass-panel">
        {/* Document Header */}
        <div className="quote-doc-header">
          <div className="quote-brand-col">
            <h2 className="quote-brand-name">TYM PRODUCTION</h2>
            <p className="quote-brand-sub">{c.brandSubtitle}</p>
          </div>
          <div className="quote-meta-col">
            <h3 className="quote-doc-title">{c.quoteTitle}</h3>
            <div className="quote-meta-line">
              <span>{c.dateLabel}</span>
              <strong>{clientProfile.date}</strong>
            </div>
            <div className="quote-meta-line">
              <span>{c.quoteNumLabel}</span>
              <strong>{clientProfile.quoteNumber}</strong>
            </div>
          </div>
        </div>

        {/* Client Recipient Box (Only renders customer info when valid private token ?q= is opened) */}
        <div className="quote-recipient-banner">
          <div className="recipient-tag">
            {clientProfile.id === 'client' ? c.recipientHeader : c.standardRecipientTag}
          </div>
          <div className="recipient-main-name">
            {clientProfile.clientName}
            {clientProfile.businessName ? ` — ${clientProfile.businessName}` : ''}
          </div>
          {clientProfile.address && (
            <div className="recipient-sub-line">
              <span>{c.addressLabel}</span> {clientProfile.address}
            </div>
          )}
          {clientProfile.id === 'client' && clientProfile.phone && (
            <div className="recipient-sub-line">
              <span>{c.phoneLabel}</span> {clientProfile.phone}
            </div>
          )}
        </div>

        <p className="quote-intro-paragraph">{c.introText}</p>

        {/* 4 Interactive Visual Service Cards */}
        <div className="quote-service-cards-grid">
          {/* CARD 1: MENU DESIGN (STATIC VS ANIMATED) */}
          <article className="quote-service-card">
            <div className="service-media-column">
              <div className="service-media-tabs no-print">
                <button
                  type="button"
                  className={`media-tab-btn ${item1MediaTab === 'animated' ? 'active' : ''}`}
                  onClick={() => setItem1MediaTab('animated')}
                >
                  {c.item1TabAnimated}
                </button>
                <button
                  type="button"
                  className={`media-tab-btn ${item1MediaTab === 'static' ? 'active' : ''}`}
                  onClick={() => setItem1MediaTab('static')}
                >
                  {c.item1TabStatic}
                </button>
              </div>

              <div className="service-media-frame">
                {item1MediaTab === 'animated' ? (
                  <ViewportVideo
                    src={mediaMenuAnimated}
                    poster="/Media/posters/menu-dong-demo.jpg"
                    width={640}
                    height={400}
                    eager={isDedicatedClientMode}
                    className="service-preview-video"
                  />
                ) : (
                  <img
                    src={mediaMenuStatic}
                    alt="Static Menu Sample"
                    width={640}
                    height={400}
                    loading={isDedicatedClientMode ? undefined : 'lazy'}
                    decoding="async"
                    className="service-preview-img"
                  />
                )}
                <button
                  type="button"
                  className="media-expand-btn no-print"
                  onClick={() =>
                    openMediaModal(
                      c.item1Title,
                      item1MediaTab === 'animated' ? 'video' : 'image',
                      item1MediaTab === 'animated' ? mediaMenuAnimated : mediaMenuStatic
                    )
                  }
                >
                  {c.expandMediaBtn}
                </button>
              </div>
            </div>

            <div className="service-details-column">
              <div className="service-card-header">
                <div>
                  <h4 className="service-item-title">{c.item1Title}</h4>
                  <p className="service-item-subtitle">{c.item1Subtitle}</p>
                </div>
                <div className="service-price-badges">
                  <div className="price-pill">
                    <span className="price-amount">$200.00</span>
                    <span className="price-unit">/ mặt tĩnh</span>
                  </div>
                  <div className="price-pill accent">
                    <span className="price-amount">$350.00</span>
                    <span className="price-unit">/ mặt động 4K</span>
                  </div>
                </div>
              </div>

              <ul className="service-bullet-list">
                {c.item1Bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <div className="service-interactive-controls no-print">
                <div className="qty-control-row">
                  <span className="qty-label">{c.item1CtrlStatic}</span>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({
                          ...s,
                          staticMenuPages: Math.max(0, s.staticMenuPages - 1)
                        }))
                      }
                      aria-label="Decrease static menu pages"
                    >
                      −
                    </button>
                    <span className="qty-value">{selections.staticMenuPages}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({ ...s, staticMenuPages: s.staticMenuPages + 1 }))
                      }
                      aria-label="Increase static menu pages"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="qty-control-row">
                  <span className="qty-label">{c.item1CtrlAnimated}</span>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({
                          ...s,
                          animatedMenuScreens: Math.max(0, s.animatedMenuScreens - 1)
                        }))
                      }
                      aria-label="Decrease animated menu screens"
                    >
                      −
                    </button>
                    <span className="qty-value">{selections.animatedMenuScreens}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({
                          ...s,
                          animatedMenuScreens: s.animatedMenuScreens + 1
                        }))
                      }
                      aria-label="Increase animated menu screens"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 2: TV INSTALLATION & VIDEO LOOP COMBO */}
          <article className="quote-service-card">
            <div className="service-media-column">
              <div className="service-media-tabs no-print">
                <button
                  type="button"
                  className={`media-tab-btn ${tvMediaTab === 'realtv' ? 'active' : ''}`}
                  onClick={() => setTvMediaTab('realtv')}
                >
                  {c.item2TabRealTV}
                </button>
                <button
                  type="button"
                  className={`media-tab-btn ${tvMediaTab === 'sampleclip' ? 'active' : ''}`}
                  onClick={() => setTvMediaTab('sampleclip')}
                >
                  {c.item2TabSampleClip}
                </button>
              </div>

              <div className="service-media-frame">
                <ViewportVideo
                  key={tvMediaTab}
                  src={tvMediaTab === 'realtv' ? mediaRealTV : mediaSampleLoopClip}
                  poster={
                    tvMediaTab === 'realtv'
                      ? '/Media/posters/real-tv-demo.jpg'
                      : '/Media/posters/sample-loop-clip.jpg'
                  }
                  width={640}
                  height={400}
                  className="service-preview-video"
                />
                <button
                  type="button"
                  className="media-expand-btn no-print"
                  onClick={() =>
                    openMediaModal(
                      c.item2Title,
                      'video',
                      tvMediaTab === 'realtv' ? mediaRealTV : mediaSampleLoopClip
                    )
                  }
                >
                  {c.expandMediaBtn}
                </button>
              </div>
            </div>

            <div className="service-details-column">
              <div className="service-card-header">
                <div>
                  <h4 className="service-item-title">{c.item2Title}</h4>
                  <p className="service-item-subtitle">{c.item2Subtitle}</p>
                </div>
                <div className="service-price-badges">
                  <div className="price-pill accent">
                    <span className="price-amount">$450.00</span>
                    <span className="price-unit">/ Combo TV 55"</span>
                  </div>
                  <div className="price-pill">
                    <span className="price-amount">+$150.00</span>
                    <span className="price-unit">/ nâng cấp TV 65"</span>
                  </div>
                  <div className="price-pill">
                    <span className="price-amount">+$100.00</span>
                    <span className="price-unit">/ extra clip 20s</span>
                  </div>
                </div>
              </div>

              <ul className="service-bullet-list">
                {c.item2Bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <div className="service-interactive-controls no-print">
                <div className="qty-control-row">
                  <span className="qty-label">{c.item2CtrlCombo}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className={`combo-toggle-btn ${
                        selections.tvComboSelected && (selections.tvSize || '55') === '55'
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        setSelections((s) => ({
                          ...s,
                          tvComboSelected: true,
                          tvSize: '55'
                        }))
                      }
                    >
                      {selections.tvComboSelected && (selections.tvSize || '55') === '55'
                        ? `✓ ${c.item2Opt55}`
                        : c.item2Opt55}
                    </button>
                    <button
                      type="button"
                      className={`combo-toggle-btn ${
                        selections.tvComboSelected && selections.tvSize === '65' ? 'selected' : ''
                      }`}
                      onClick={() =>
                        setSelections((s) => ({
                          ...s,
                          tvComboSelected: true,
                          tvSize: '65'
                        }))
                      }
                    >
                      {selections.tvComboSelected && selections.tvSize === '65'
                        ? `✓ ${c.item2Opt65}`
                        : c.item2Opt65}
                    </button>
                    <button
                      type="button"
                      className={`combo-toggle-btn ${!selections.tvComboSelected ? 'selected' : ''}`}
                      onClick={() =>
                        setSelections((s) => ({ ...s, tvComboSelected: false }))
                      }
                    >
                      {c.notSelected}
                    </button>
                  </div>
                </div>

                <div className="qty-control-row">
                  <span className="qty-label">{c.item2CtrlExtra}</span>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({
                          ...s,
                          tvExtraClips: Math.max(0, s.tvExtraClips - 1)
                        }))
                      }
                      aria-label="Decrease extra TV clips"
                    >
                      −
                    </button>
                    <span className="qty-value">{selections.tvExtraClips}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({ ...s, tvExtraClips: s.tvExtraClips + 1 }))
                      }
                      aria-label="Increase extra TV clips"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 3: BASIC PROMO CLIP 20S */}
          <article className="quote-service-card">
            <div className="service-media-column">
              <div className="service-media-frame">
                <ViewportVideo
                  src={mediaBasicClip}
                  poster="/Media/posters/clip-co-ban-demo.jpg"
                  width={640}
                  height={400}
                  className="service-preview-video"
                />
                <button
                  type="button"
                  className="media-expand-btn no-print"
                  onClick={() => openMediaModal(c.item3Title, 'video', mediaBasicClip)}
                >
                  {c.expandMediaBtn}
                </button>
              </div>
            </div>

            <div className="service-details-column">
              <div className="service-card-header">
                <div>
                  <h4 className="service-item-title">{c.item3Title}</h4>
                  <p className="service-item-subtitle">{c.item3Subtitle}</p>
                </div>
                <div className="service-price-badges">
                  <div className="price-pill">
                    <span className="price-amount">$100.00</span>
                    <span className="price-unit">/ clip (20 giây)</span>
                  </div>
                </div>
              </div>

              <ul className="service-bullet-list">
                {c.item3Bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <div className="service-interactive-controls no-print">
                <div className="qty-control-row">
                  <span className="qty-label">{c.item3CtrlClips}</span>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({
                          ...s,
                          basicClips: Math.max(0, s.basicClips - 1)
                        }))
                      }
                      aria-label="Decrease basic clips"
                    >
                      −
                    </button>
                    <span className="qty-value">{selections.basicClips}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({ ...s, basicClips: s.basicClips + 1 }))
                      }
                      aria-label="Increase basic clips"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 4: INFLUENCER / UGC TASTING REVIEW AD VIDEO */}
          <article className="quote-service-card">
            <div className="service-media-column">
              <div className="service-media-frame portrait-showcase">
                <ViewportVideo
                  src={mediaInfluencerClip}
                  poster="/Media/posters/clip-influencer-demo.jpg"
                  width={540}
                  height={960}
                  className="service-preview-video"
                />
                <button
                  type="button"
                  className="media-expand-btn no-print"
                  onClick={() => openMediaModal(c.item4Title, 'video', mediaInfluencerClip)}
                >
                  {c.expandAudioVideoBtn}
                </button>
              </div>
            </div>

            <div className="service-details-column">
              <div className="service-card-header">
                <div>
                  <h4 className="service-item-title">{c.item4Title}</h4>
                  <p className="service-item-subtitle">{c.item4Subtitle}</p>
                </div>
                <div className="service-price-badges">
                  <div className="price-pill accent">
                    <span className="price-amount">$200.00</span>
                    <span className="price-unit">/ clip (30–35s)</span>
                  </div>
                </div>
              </div>

              <ul className="service-bullet-list">
                {c.item4Bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <div className="service-interactive-controls no-print">
                <div className="qty-control-row">
                  <span className="qty-label">{c.item4CtrlClips}</span>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({
                          ...s,
                          influencerClips: Math.max(0, s.influencerClips - 1)
                        }))
                      }
                      aria-label="Decrease influencer ad clips"
                    >
                      −
                    </button>
                    <span className="qty-value">{selections.influencerClips}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({
                          ...s,
                          influencerClips: s.influencerClips + 1
                        }))
                      }
                      aria-label="Increase influencer ad clips"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 5: STOREFRONT WINDOW DECAL INSTALLATION (LAST ITEM) */}
          <article className="quote-service-card">
            <div className="service-media-column">
              <div className="service-media-frame">
                <img
                  src={mediaDecalStorefront}
                  alt="Storefront Window Decal"
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="service-preview-img"
                  style={{ objectPosition: 'left center' }}
                />
                <button
                  type="button"
                  className="media-expand-btn no-print"
                  onClick={() => openMediaModal(c.item5Title, 'image', mediaDecalStorefront)}
                >
                  {c.expandMediaBtn}
                </button>
              </div>
            </div>

            <div className="service-details-column">
              <div className="service-card-header">
                <div>
                  <h4 className="service-item-title">{c.item5Title}</h4>
                  <p className="service-item-subtitle">{c.item5Subtitle}</p>
                </div>
                <div className="service-price-badges">
                  <div className="price-pill">
                    <span className="price-amount">$100.00</span>
                    <span className="price-unit">/ mặt kính (tối thiểu 2)</span>
                  </div>
                </div>
              </div>

              <ul className="service-bullet-list">
                {c.item5Bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <div className="service-interactive-controls no-print">
                <div className="qty-control-row">
                  <span className="qty-label">{c.item5CtrlPanels}</span>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() => adjustDecalPanels(-1)}
                      aria-label="Decrease decal glass panels"
                    >
                      −
                    </button>
                    <span className="qty-value">{selections.decalPanels}</span>
                    <button
                      type="button"
                      onClick={() => adjustDecalPanels(1)}
                      aria-label="Increase decal glass panels"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="qty-control-row">
                  <span className="qty-label">{c.item5CtrlDesign}</span>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({
                          ...s,
                          decalDesignCount: Math.max(0, s.decalDesignCount - 1)
                        }))
                      }
                      aria-label="Decrease decal design count"
                    >
                      −
                    </button>
                    <span className="qty-value">{selections.decalDesignCount}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelections((s) => ({ ...s, decalDesignCount: s.decalDesignCount + 1 }))
                      }
                      aria-label="Increase decal design count"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Responsive Summary Data Table (following responsive-table guidance) */}
        <div
          tabIndex={0}
          role="region"
          aria-labelledby={tableCaptionId}
          className="quote-table-wrapper"
        >
          <table
            className="quote-summary-table"
            style={
              {
                '--label-2': `"${c.colUnitPrice}"`,
                '--label-3': `"${c.colQty}"`,
                '--label-4': `"${c.colSubtotal}"`
              } as React.CSSProperties
            }
          >
            <caption id={tableCaptionId} className="quote-table-caption">
              {c.summaryCaption}
            </caption>
            <thead>
              <tr>
                <th scope="col">{c.colService}</th>
                <th scope="col">{c.colUnitPrice}</th>
                <th scope="col">{c.colQty}</th>
                <th scope="col">{c.colSubtotal}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{c.row1aTitle}</th>
                <td>$200.00 / mặt</td>
                <td>{selections.staticMenuPages} mặt</td>
                <td>${staticMenuSubtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <th scope="row">{c.row1bTitle}</th>
                <td>$350.00 / mặt màn hình</td>
                <td>{selections.animatedMenuScreens} mặt</td>
                <td>${animatedMenuSubtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <th scope="row">
                  2. Gói Combo: Lắp đặt TV {selections.tvSize === '65' ? '65"' : '55"'} &amp; Loop 3 Clip (1 phút)
                </th>
                <td>$450.00 / gói (TV 65": +$150 | Extra clip: +$100)</td>
                <td>
                  {selections.tvComboSelected
                    ? selections.tvSize === '65'
                      ? '1 gói Combo TV 65" (+$150)'
                      : '1 gói Combo TV 55"'
                    : '0'}
                  {selections.tvExtraClips > 0 ? ` (+${selections.tvExtraClips} extra clip)` : ''}
                </td>
                <td>${item2Subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <th scope="row">{c.row3Title}</th>
                <td>$100.00 / clip</td>
                <td>{selections.basicClips} clip</td>
                <td>${item3Subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <th scope="row">{c.row4Title}</th>
                <td>$200.00 / clip</td>
                <td>{selections.influencerClips} clip</td>
                <td>${item4Subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <th scope="row">{c.row5Title}</th>
                <td>$100.00 / mặt kính</td>
                <td>
                  {selections.decalPanels} mặt kính
                  {selections.decalDesignCount > 0
                    ? ` (+${selections.decalDesignCount} mẫu thiết kế)`
                    : ''}
                </td>
                <td>${item5Subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals & 30% Deposit Breakdown */}
        <div className="quote-totals-footer-grid">
          <div className="quote-terms-box">
            <h5>{c.termsTitle}</h5>
            <ul>
              <li>{c.termValidity}</li>
              <li>{c.termPayment}</li>
              <li>{c.termExclusions}</li>
            </ul>
          </div>

          <div className="quote-totals-box">
            <div className="total-row grand">
              <span>{c.totalSelectedLabel}</span>
              <strong>${grandTotal.toFixed(2)}</strong>
            </div>
            <div className="total-row deposit">
              <span>{c.depositLabel}</span>
              <strong>${depositAmount.toFixed(2)}</strong>
            </div>
            <div className="total-row balance">
              <span>{c.balanceLabel}</span>
              <span>${balanceAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Actions (No-print) */}
        <div className="quote-bottom-cta-bar no-print">
          <button
            type="button"
            className="quote-cta-btn primary"
            onClick={() => window.print()}
          >
            {c.btnPrintPdf}
          </button>
          <a
            href={`sms:+14389857846?&body=${buildConfirmationBody()}`}
            className="quote-cta-btn secondary"
          >
            {c.btnSendSms}
          </a>
          <a
            href={`mailto:lebachanhtruc@gmail.com?subject=${encodeURIComponent(
              `Xác nhận Báo Giá ${clientProfile.quoteNumber} - ${clientProfile.clientName}`
            )}&body=${buildConfirmationBody()}`}
            className="quote-cta-btn secondary"
          >
            {c.btnSendEmail}
          </a>
        </div>
      </div>

      {/* Modal 1: Fullscreen Media Lightbox Dialog (native <dialog closedby="any">) */}
      <dialog
        ref={previewDialogRef}
        {...({ closedby: 'any' } as any)}
        onClose={() => setPreviewMedia(null)}
        aria-labelledby={previewDialogTitleId}
        className="quote-native-dialog media-dialog"
      >
        <div className="dialog-inner-box">
          <div className="dialog-top-bar">
            <h3 id={previewDialogTitleId}>{previewMedia?.title}</h3>
            <form method="dialog">
              <button type="submit" className="dialog-close-btn">
                ✕ {c.closeModalBtn}
              </button>
            </form>
          </div>
          <div className="dialog-media-stage">
            {previewMedia?.type === 'video' ? (
              <video
                src={previewMedia.src}
                controls
                autoPlay
                loop
                playsInline
                className="dialog-full-video"
              />
            ) : previewMedia?.type === 'image' ? (
              <img src={previewMedia.src} alt={previewMedia.title} className="dialog-full-img" />
            ) : null}
          </div>
        </div>
      </dialog>

      {/* Modal 2: Admin-Only Client Quote Link Generator (native <dialog closedby="any">) */}
      {isAdminUnlocked && (
        <dialog
          ref={generatorDialogRef}
          {...({ closedby: 'any' } as any)}
          aria-labelledby={generatorDialogTitleId}
          className="quote-native-dialog generator-dialog"
        >
          <div className="dialog-inner-box">
            <div className="dialog-top-bar">
              <h3 id={generatorDialogTitleId}>{c.generatorTitle}</h3>
              <form method="dialog">
                <button type="submit" className="dialog-close-btn">
                  ✕ {c.closeModalBtn}
                </button>
              </form>
            </div>
            <p className="generator-modal-desc">{c.generatorDesc}</p>
            <form onSubmit={handleCreateNewClientSubmit} className="generator-form">
              <label>
                <span>{c.fieldClientName} *</span>
                <input
                  type="text"
                  required
                  placeholder="VD: Chị Lan / Anh Minh"
                  value={newClientForm.clientName}
                  onChange={(e) =>
                    setNewClientForm((f) => ({ ...f, clientName: e.target.value }))
                  }
                />
              </label>
              <label>
                <span>{c.fieldBusiness}</span>
                <input
                  type="text"
                  placeholder="VD: Bistro Japonais / Café..."
                  value={newClientForm.businessName}
                  onChange={(e) =>
                    setNewClientForm((f) => ({ ...f, businessName: e.target.value }))
                  }
                />
              </label>
              <label>
                <span>{c.fieldAddress}</span>
                <input
                  type="text"
                  placeholder="VD: 123 Rue Exemple, Montréal, QC"
                  value={newClientForm.address}
                  onChange={(e) => setNewClientForm((f) => ({ ...f, address: e.target.value }))}
                />
              </label>
              <div className="generator-form-row">
                <label>
                  <span>{c.fieldPhone}</span>
                  <input
                    type="text"
                    placeholder="VD: +1 (514) 000-0000"
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </label>
                <label>
                  <span>{c.fieldQuoteNum}</span>
                  <input
                    type="text"
                    value={newClientForm.quoteNumber}
                    onChange={(e) =>
                      setNewClientForm((f) => ({ ...f, quoteNumber: e.target.value }))
                    }
                  />
                </label>
              </div>
              <label className="generator-checkbox-row">
                <input
                  type="checkbox"
                  checked={includeCurrentSelections}
                  onChange={(e) => setIncludeCurrentSelections(e.target.checked)}
                />
                <span>{c.adminIncludeSelections}</span>
              </label>
              <button type="submit" className="quote-cta-btn primary full-width">
                {c.btnApplyAndCopy}
              </button>
            </form>
          </div>
        </dialog>
      )}

      {/* Modal 3: Studio Admin PIN Unlock Dialog (native <dialog closedby="any">) */}
      <dialog
        ref={pinDialogRef}
        {...({ closedby: 'any' } as any)}
        aria-labelledby={pinDialogTitleId}
        className="quote-native-dialog generator-dialog admin-pin-dialog"
      >
        <div className="dialog-inner-box">
          <div className="dialog-top-bar">
            <h3 id={pinDialogTitleId}>{c.adminPinTitle}</h3>
            <form method="dialog">
              <button type="submit" className="dialog-close-btn">
                ✕ {c.closeModalBtn}
              </button>
            </form>
          </div>
          <p className="generator-modal-desc">{c.adminPinDesc}</p>
          <form onSubmit={handleUnlockAdminSubmit} className="generator-form">
            <label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder={c.adminPinPlaceholder}
                value={adminPinInput}
                onChange={(e) => {
                  setAdminPinInput(e.target.value);
                  if (adminPinError) setAdminPinError(false);
                }}
              />
            </label>
            {adminPinError && <p className="admin-pin-error">{c.adminPinWrong}</p>}
            <button type="submit" className="quote-cta-btn primary full-width">
              {c.adminUnlockSubmit}
            </button>
          </form>
        </div>
      </dialog>
    </section>
  );
}

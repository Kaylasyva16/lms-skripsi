import svgPaths from "./svg-lltqdcymrh";

function Icon() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute h-[36px] left-[32px] rounded-[8px] top-[32px] w-[223.227px]" data-name="Button">
      <Icon />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[44px] not-italic text-[#155dfc] text-[14px] text-nowrap top-[8.5px] tracking-[-0.1504px] whitespace-pre">Kembali ke Daftar Project</p>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">Sistem Kasir Minimarket</p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[276px]">Progress Pengerjaan: Kelompok Alpha</p>
    </div>
  );
}

function Container() {
  return (
    <div className="basis-0 grow h-[48px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[48px] items-start relative w-full">
        <CardTitle />
        <CardDescription />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[9px] size-[12px] top-[5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2028_1085)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 4V6" id="Vector_2" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 8H6.005" id="Vector_3" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2028_1085">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[#eceef2] h-[22px] relative rounded-[8px] shrink-0 w-[118.656px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] overflow-clip relative rounded-[inherit] w-[118.656px]">
        <Icon1 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[29px] not-italic text-[#030213] text-[12px] text-nowrap top-[4px] whitespace-pre">Belum Selesai</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ProjectProgressDetail() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-start justify-between left-[25px] top-[25px] w-[1070px]" data-name="ProjectProgressDetail">
      <Container />
      <Badge />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Anggota Kelompok:</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1c398e] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Ahmad Syarif</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-px whitespace-pre">Project Leader</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[52px] top-[8px] w-[86.141px]" data-name="Container">
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 bg-[#2b7fff] grow h-[32px] min-h-px min-w-px relative rounded-[1.67772e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[32px] items-center justify-center relative w-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">AS</p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex items-start left-[12px] overflow-clip rounded-[1.67772e+07px] size-[32px] top-[10px]" data-name="Primitive.span">
      <Text />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-blue-50 h-[52px] left-0 rounded-[10px] top-0 w-[150.141px]" data-name="Container">
      <Container1 />
      <PrimitiveSpan />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1c398e] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Budi Santoso</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-px whitespace-pre">Database Designer</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[52px] top-[8px] w-[107.391px]" data-name="Container">
      <Paragraph3 />
      <Paragraph4 />
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 bg-[#2b7fff] grow h-[32px] min-h-px min-w-px relative rounded-[1.67772e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[32px] items-center justify-center relative w-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">BS</p>
      </div>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="absolute content-stretch flex items-start left-[12px] overflow-clip rounded-[1.67772e+07px] size-[32px] top-[10px]" data-name="Primitive.span">
      <Text1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-blue-50 h-[52px] left-[162.14px] rounded-[10px] top-0 w-[171.391px]" data-name="Container">
      <Container3 />
      <PrimitiveSpan1 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1c398e] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Citra Dewi</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-px whitespace-pre">UI/UX Designer</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[52px] top-[8px] w-[86.648px]" data-name="Container">
      <Paragraph5 />
      <Paragraph6 />
    </div>
  );
}

function Text2() {
  return (
    <div className="basis-0 bg-[#2b7fff] grow h-[32px] min-h-px min-w-px relative rounded-[1.67772e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[32px] items-center justify-center relative w-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">CD</p>
      </div>
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="absolute content-stretch flex items-start left-[12px] overflow-clip rounded-[1.67772e+07px] size-[32px] top-[10px]" data-name="Primitive.span">
      <Text2 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-blue-50 h-[52px] left-[345.53px] rounded-[10px] top-0 w-[150.648px]" data-name="Container">
      <Container5 />
      <PrimitiveSpan2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container4 />
      <Container6 />
    </div>
  );
}

function ProjectProgressDetail1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[84px] items-start relative shrink-0 w-full" data-name="ProjectProgressDetail">
      <Paragraph />
      <Container7 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[140.742px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[140.742px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Progress Keseluruhan</p>
      </div>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[206.461px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[206.461px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1c398e] text-[14px] top-[0.5px] tracking-[-0.1504px] w-[207px]">0/6 Sintaks Selesai (2/18 Tahap)</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function Container9() {
  return <div className="bg-[#030213] h-[12px] shrink-0 w-full" data-name="Container" />;
}

function PrimitiveDiv() {
  return (
    <div className="bg-[rgba(3,2,19,0.2)] box-border content-stretch flex flex-col h-[12px] items-start overflow-clip pr-[951.111px] py-0 relative rounded-[1.67772e+07px] shrink-0 w-full" data-name="Primitive.div">
      <Container9 />
    </div>
  );
}

function ProjectProgressDetail2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[40px] items-start relative shrink-0 w-full" data-name="ProjectProgressDetail">
      <Container8 />
      <PrimitiveDiv />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[13px] size-[20px] top-[15px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2028_1064)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #D08700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 6.66667V10" id="Vector_2" stroke="var(--stroke-0, #D08700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 13.3333H10.0083" id="Vector_3" stroke="var(--stroke-0, #D08700)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2028_1064">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#733e0a] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Kelompok ini belum bisa dinilai karena belum menyelesaikan semua sintaks.</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#a65f00] text-[12px] text-nowrap top-px whitespace-pre">Siswa harus menyelesaikan 6 sintaks (17 tahap) untuk mendapatkan nilai.</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[40px] items-start left-[41px] top-[13px] w-[486px]" data-name="Container">
      <Paragraph9 />
      <Paragraph10 />
    </div>
  );
}

function ProjectProgressDetail3() {
  return (
    <div className="bg-yellow-50 h-[66px] relative rounded-[10px] shrink-0 w-full" data-name="ProjectProgressDetail">
      <div aria-hidden="true" className="absolute border border-[#fff085] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon2 />
      <Container10 />
    </div>
  );
}

function CardContent() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[16px] h-[246px] items-start left-px px-[24px] py-0 top-[103px] w-[1118px]" data-name="CardContent">
      <ProjectProgressDetail1 />
      <ProjectProgressDetail2 />
      <ProjectProgressDetail3 />
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-white h-[350px] left-[32px] rounded-[14px] top-[92px] w-[1120px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProjectProgressDetail />
      <CardContent />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2028_1079)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2028_1079">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-white top-px w-[52px]">Sintaks 1</p>
      </div>
    </div>
  );
}

function ProjectProgressDetail4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[73.438px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[16px] items-center relative w-[73.438px]">
        <Icon3 />
        <Text3 />
      </div>
    </div>
  );
}

function ProjectProgressDetail5() {
  return (
    <div className="h-[15px] opacity-80 relative shrink-0 w-[114.438px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[15px] relative w-[114.438px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[57px] not-italic text-[12px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Identifikasi Masalah</p>
      </div>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="absolute bg-[#2b7fff] box-border content-stretch flex flex-col gap-[6px] h-[63px] items-center justify-center left-[4px] p-px rounded-[14px] top-[4px] w-[173.664px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProjectProgressDetail4 />
      <ProjectProgressDetail5 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-neutral-950 top-px w-[54px]">Sintaks 2</p>
      </div>
    </div>
  );
}

function ProjectProgressDetail6() {
  return (
    <div className="h-[16px] relative shrink-0 w-[75.078px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[16px] items-center relative w-[75.078px]">
        <Icon4 />
        <Text4 />
      </div>
    </div>
  );
}

function ProjectProgressDetail7() {
  return (
    <div className="h-[15px] opacity-80 relative shrink-0 w-[128.883px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[15px] relative w-[128.883px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[64.5px] not-italic text-[12px] text-center text-neutral-950 text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">Merencanakan Project</p>
      </div>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[6px] h-[63px] items-center justify-center left-[181.66px] p-px rounded-[14px] top-[4px] w-[173.664px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProjectProgressDetail6 />
      <ProjectProgressDetail7 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-neutral-950 top-px w-[54px]">Sintaks 3</p>
      </div>
    </div>
  );
}

function ProjectProgressDetail8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[75.367px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[16px] items-center relative w-[75.367px]">
        <Icon5 />
        <Text5 />
      </div>
    </div>
  );
}

function ProjectProgressDetail9() {
  return (
    <div className="h-[15px] opacity-80 relative shrink-0 w-[102.914px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[15px] relative w-[102.914px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[51px] not-italic text-[12px] text-center text-neutral-950 text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">Menyusun Jadwal</p>
      </div>
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[6px] h-[63px] items-center justify-center left-[359.33px] p-px rounded-[14px] top-[4px] w-[173.672px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProjectProgressDetail8 />
      <ProjectProgressDetail9 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-neutral-950 top-px w-[54px]">Sintaks 4</p>
      </div>
    </div>
  );
}

function ProjectProgressDetail10() {
  return (
    <div className="h-[16px] relative shrink-0 w-[75.57px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[16px] items-center relative w-[75.57px]">
        <Icon6 />
        <Text6 />
      </div>
    </div>
  );
}

function ProjectProgressDetail11() {
  return (
    <div className="h-[15px] opacity-80 relative shrink-0 w-[109.703px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[15px] relative w-[109.703px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[55.5px] not-italic text-[12px] text-center text-neutral-950 text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">Pembuatan Project</p>
      </div>
    </div>
  );
}

function PrimitiveButton3() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[6px] h-[63px] items-center justify-center left-[537px] p-px rounded-[14px] top-[4px] w-[173.664px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProjectProgressDetail10 />
      <ProjectProgressDetail11 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-neutral-950 top-px w-[54px]">Sintaks 5</p>
      </div>
    </div>
  );
}

function ProjectProgressDetail12() {
  return (
    <div className="h-[16px] relative shrink-0 w-[75.273px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[16px] items-center relative w-[75.273px]">
        <Icon7 />
        <Text7 />
      </div>
    </div>
  );
}

function ProjectProgressDetail13() {
  return (
    <div className="h-[15px] opacity-80 relative shrink-0 w-[73.086px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[15px] relative w-[73.086px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[37px] not-italic text-[12px] text-center text-neutral-950 text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">Hasil Project</p>
      </div>
    </div>
  );
}

function PrimitiveButton4() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[6px] h-[63px] items-center justify-center left-[714.66px] p-px rounded-[14px] top-[4px] w-[173.664px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProjectProgressDetail12 />
      <ProjectProgressDetail13 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="basis-0 grow h-[16px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[16px] relative w-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[12px] text-neutral-950 top-px w-[54px]">Sintaks 6</p>
      </div>
    </div>
  );
}

function ProjectProgressDetail14() {
  return (
    <div className="h-[16px] relative shrink-0 w-[75.5px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[16px] items-center relative w-[75.5px]">
        <Icon8 />
        <Text8 />
      </div>
    </div>
  );
}

function ProjectProgressDetail15() {
  return (
    <div className="h-[15px] opacity-80 relative shrink-0 w-[47.203px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[15px] relative w-[47.203px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-[24px] not-italic text-[12px] text-center text-neutral-950 text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">Evaluasi</p>
      </div>
    </div>
  );
}

function PrimitiveButton5() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[6px] h-[63px] items-center justify-center left-[892.33px] p-px rounded-[14px] top-[4px] w-[173.672px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProjectProgressDetail14 />
      <ProjectProgressDetail15 />
    </div>
  );
}

function TabList() {
  return (
    <div className="bg-[#ececf0] h-[71px] relative rounded-[14px] shrink-0 w-[1070px]" data-name="Tab List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[71px] relative w-[1070px]">
        <PrimitiveButton />
        <PrimitiveButton1 />
        <PrimitiveButton2 />
        <PrimitiveButton3 />
        <PrimitiveButton4 />
        <PrimitiveButton5 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1c398e] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[215px]">Sintaks 1: Identifikasi Masalah</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Mengidentifikasi dan merumuskan masalah yang akan diselesaikan</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="basis-0 grow h-[52px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[52px] items-start relative w-full">
        <Heading />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[9px] size-[12px] top-[5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2028_1038)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2028_1038">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[#2b7fff] h-[22px] relative rounded-[8px] shrink-0 w-[145.5px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[22px] overflow-clip relative rounded-[inherit] w-[145.5px]">
        <Icon9 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[29px] not-italic text-[12px] text-nowrap text-white top-[4px] whitespace-pre">Sedang Dikerjakan</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex h-[52px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Badge1 />
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[118.148px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[118.148px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px] w-[119px]">Progress Sintaks 1</p>
      </div>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[113.422px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[113.422px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1c398e] text-[14px] top-[0.5px] tracking-[-0.1504px] w-[114px]">2/4 Tahap Selesai</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph12 />
      <Paragraph13 />
    </div>
  );
}

function Container14() {
  return <div className="bg-[#030213] h-[8px] shrink-0 w-full" data-name="Container" />;
}

function PrimitiveDiv1() {
  return (
    <div className="bg-[rgba(3,2,19,0.2)] box-border content-stretch flex flex-col h-[8px] items-start overflow-clip pr-[535px] py-0 relative rounded-[1.67772e+07px] shrink-0 w-full" data-name="Primitive.div">
      <Container14 />
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute h-[22px] left-0 rounded-[8px] top-0 w-[134.547px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[134.547px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] text-nowrap whitespace-pre">1 Sedang Dikerjakan</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute h-[22px] left-[142.55px] rounded-[8px] top-0 w-[102.82px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[102.82px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#c10007] text-[12px] text-nowrap whitespace-pre">1 Perlu Direvisi</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="Container">
      <Badge2 />
      <Badge3 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[66px] items-start relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <PrimitiveDiv1 />
      <Container15 />
    </div>
  );
}

function ProjectProgressDetail16() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[134px] items-start relative shrink-0 w-full" data-name="ProjectProgressDetail">
      <Container12 />
      <Container16 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1c398e] text-[16px] text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">Tahap-tahap Pengerjaan</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
            <path d={svgPaths.pb60700} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 6">
            <path d="M1 3L3 5L7 1" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[24px] top-[4px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[193.023px]" data-name="Heading 5">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1c398e] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[194px]">Tahap 1: Orientasi Masalah</p>
    </div>
  );
}

function Badge4() {
  return (
    <div className="absolute bg-[#00c950] h-[22px] left-[201.02px] rounded-[8px] top-px w-[59.297px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[59.297px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Selesai</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Badge4 />
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Memahami konteks permasalahan</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[48px] items-start left-[36px] top-0 w-[982px]" data-name="Container">
      <Container18 />
      <Paragraph14 />
    </div>
  );
}

function ProjectProgressDetail17() {
  return (
    <div className="absolute h-[48px] left-[24px] top-[16px] w-[1018px]" data-name="ProjectProgressDetail">
      <Container17 />
      <Container19 />
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Hasil Pengerjaan:</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-white h-[46px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[13px] not-italic text-[#364153] text-[14px] text-nowrap top-[13.5px] tracking-[-0.1504px] whitespace-pre">Minimarket membutuhkan sistem kasir yang efisien untuk mengelola transaksi penjualan, stok barang, dan laporan keuangan secara digital.</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[70px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Container20 />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-0 w-[982px]" data-name="Primitive.label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Status Pengerjaan:</p>
    </div>
  );
}

function Badge5() {
  return (
    <div className="absolute bg-[#00c950] h-[22px] left-0 rounded-[8px] top-[26.5px] w-[59.297px]" data-name="Badge">
      <div className="h-[22px] overflow-clip relative rounded-[inherit] w-[59.297px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[9px] not-italic text-[12px] text-nowrap text-white top-[4px] whitespace-pre">Selesai</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[48.5px] relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel1 />
      <Badge5 />
    </div>
  );
}

function PrimitiveLabel2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[91.5px]" data-name="Primitive.label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[16px] items-center relative w-[91.5px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Feedback Guru:</p>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[6px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2028_1061)" id="Icon">
          <path d={svgPaths.p23dee900} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2028_1061">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[28px] relative rounded-[8px] shrink-0 w-[73.594px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28px] relative w-[73.594px]">
        <Icon11 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[37px] not-italic text-[14px] text-neutral-950 text-nowrap top-[4.5px] tracking-[-0.1504px] whitespace-pre">Edit</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel2 />
      <Button1 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #0D542B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="absolute h-[20px] left-[24px] top-0 w-[608.078px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0d542b] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Bagus! Orientasi masalah sudah jelas dan konteks permasalahan sudah dipahami dengan baik.</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <Icon12 />
      <Paragraph15 />
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-green-50 h-[46px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[46px] items-start pb-px pt-[13px] px-[13px] relative w-full">
          <Container24 />
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[82px] items-start relative shrink-0 w-full" data-name="Container">
      <Container23 />
      <Container25 />
    </div>
  );
}

function ProjectProgressDetail18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[224.5px] items-start left-[60px] top-[76px] w-[982px]" data-name="ProjectProgressDetail">
      <Container21 />
      <Container22 />
      <Container26 />
    </div>
  );
}

function CardContent1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1066px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[1066px]">
        <ProjectProgressDetail17 />
        <ProjectProgressDetail18 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="[grid-area:1_/_1] bg-green-50 box-border content-stretch flex flex-col items-start p-[2px] relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-2 border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent1 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
            <path d={svgPaths.pb60700} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 6">
            <path d="M1 3L3 5L7 1" id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[24px] top-[4px]" data-name="Container">
      <Icon13 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[197.633px]" data-name="Heading 5">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1c398e] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[198px]">Tahap 2: Rumusan Masalah</p>
    </div>
  );
}

function Badge6() {
  return (
    <div className="absolute bg-[#00c950] h-[22px] left-[205.63px] rounded-[8px] top-px w-[59.297px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[59.297px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Selesai</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Badge6 />
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Merumuskan masalah secara jelas</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[48px] items-start left-[36px] top-0 w-[982px]" data-name="Container">
      <Container28 />
      <Paragraph16 />
    </div>
  );
}

function ProjectProgressDetail19() {
  return (
    <div className="absolute h-[48px] left-[24px] top-[16px] w-[1018px]" data-name="ProjectProgressDetail">
      <Container27 />
      <Container29 />
    </div>
  );
}

function PrimitiveLabel3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Hasil Pengerjaan:</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="bg-white h-[66px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[13px] not-italic text-[#364153] text-[14px] top-[13.5px] tracking-[-0.1504px] w-[919px]">Bagaimana membuat sistem kasir yang efisien dan mudah digunakan untuk minimarket dengan fitur manajemen produk, transaksi, dan laporan penjualan?</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[90px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel3 />
      <Container30 />
    </div>
  );
}

function PrimitiveLabel4() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-0 w-[982px]" data-name="Primitive.label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Status Pengerjaan:</p>
    </div>
  );
}

function Badge7() {
  return (
    <div className="absolute bg-[#00c950] h-[22px] left-0 rounded-[8px] top-[26.5px] w-[59.297px]" data-name="Badge">
      <div className="h-[22px] overflow-clip relative rounded-[inherit] w-[59.297px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[9px] not-italic text-[12px] text-nowrap text-white top-[4px] whitespace-pre">Selesai</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[48.5px] relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel4 />
      <Badge7 />
    </div>
  );
}

function PrimitiveLabel5() {
  return (
    <div className="h-[16px] relative shrink-0 w-[91.5px]" data-name="Primitive.label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[16px] items-center relative w-[91.5px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Feedback Guru:</p>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[6px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2028_1061)" id="Icon">
          <path d={svgPaths.p23dee900} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2028_1061">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[28px] relative rounded-[8px] shrink-0 w-[73.594px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28px] relative w-[73.594px]">
        <Icon14 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[37px] not-italic text-[14px] text-neutral-950 text-nowrap top-[4.5px] tracking-[-0.1504px] whitespace-pre">Edit</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel5 />
      <Button2 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #0D542B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="absolute h-[20px] left-[24px] top-0 w-[773.492px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#0d542b] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Rumusan masalah sudah terstruktur dengan baik. Pertanyaan penelitian sudah mencakup aspek utama dari sistem kasir.</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <Icon15 />
      <Paragraph17 />
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-green-50 h-[46px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[46px] items-start pb-px pt-[13px] px-[13px] relative w-full">
          <Container34 />
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[82px] items-start relative shrink-0 w-full" data-name="Container">
      <Container33 />
      <Container35 />
    </div>
  );
}

function PrimitiveLabel6() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Artikel Referensi:</p>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Link">
      <Icon16 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[20px] not-italic text-[#155dfc] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">https://pintar.com/cara-membuat-rumusan-masalah</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[44px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel6 />
      <Link />
    </div>
  );
}

function ProjectProgressDetail20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[300.5px] items-start left-[60px] top-[76px] w-[982px]" data-name="ProjectProgressDetail">
      <Container31 />
      <Container32 />
      <Container36 />
      <Container37 />
    </div>
  );
}

function CardContent2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1066px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[1066px]">
        <ProjectProgressDetail19 />
        <ProjectProgressDetail20 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="[grid-area:2_/_1] bg-green-50 box-border content-stretch flex flex-col items-start p-[2px] relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-2 border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent2 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
            <path d={svgPaths.pb60700} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <path d="M7 1L1 7" id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <path d="M1 1L7 7" id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[24px] top-[4px]" data-name="Container">
      <Icon17 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[223.18px]" data-name="Heading 5">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1c398e] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[224px]">Tahap 3: Menentukan Indikator</p>
    </div>
  );
}

function Badge8() {
  return (
    <div className="absolute bg-[#fb2c36] h-[22px] left-[231.18px] rounded-[8px] top-px w-[93.773px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[93.773px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Perlu Direvisi</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Badge8 />
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Menetapkan indikator keberhasilan</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[48px] items-start left-[36px] top-0 w-[982px]" data-name="Container">
      <Container39 />
      <Paragraph18 />
    </div>
  );
}

function ProjectProgressDetail21() {
  return (
    <div className="absolute h-[48px] left-[24px] top-[16px] w-[1018px]" data-name="ProjectProgressDetail">
      <Container38 />
      <Container40 />
    </div>
  );
}

function PrimitiveLabel7() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Hasil Pengerjaan:</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="bg-white h-[46px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[13px] not-italic text-[#364153] text-[14px] text-nowrap top-[13.5px] tracking-[-0.1504px] whitespace-pre">Indikator: Sistem dapat melakukan transaksi dengan cepat, mengelola stok barang, dan menghasilkan laporan penjualan.</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[70px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel7 />
      <Container41 />
    </div>
  );
}

function PrimitiveLabel8() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-0 w-[982px]" data-name="Primitive.label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Status Pengerjaan:</p>
    </div>
  );
}

function Badge9() {
  return (
    <div className="absolute bg-[#fb2c36] h-[22px] left-0 rounded-[8px] top-[26.5px] w-[93.773px]" data-name="Badge">
      <div className="h-[22px] overflow-clip relative rounded-[inherit] w-[93.773px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[9px] not-italic text-[12px] text-nowrap text-white top-[4px] whitespace-pre">Perlu Direvisi</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[48.5px] relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel8 />
      <Badge9 />
    </div>
  );
}

function PrimitiveLabel9() {
  return (
    <div className="h-[16px] relative shrink-0 w-[91.5px]" data-name="Primitive.label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[16px] items-center relative w-[91.5px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Feedback Guru:</p>
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[6px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2028_1061)" id="Icon">
          <path d={svgPaths.p23dee900} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2028_1061">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[28px] relative rounded-[8px] shrink-0 w-[73.594px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28px] relative w-[73.594px]">
        <Icon18 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[37px] not-italic text-[14px] text-neutral-950 text-nowrap top-[4.5px] tracking-[-0.1504px] whitespace-pre">Edit</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel9 />
      <Button3 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p405f80} id="Vector" stroke="var(--stroke-0, #82181A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="absolute h-[20px] left-[24px] top-0 w-[895.375px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#82181a] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">{`Indikator keberhasilan perlu ditambahkan dengan metrik yang lebih spesifik. Contoh: waktu transaksi < 2 menit, tingkat kesalahan < 1%, dll.`}</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <Icon19 />
      <Paragraph19 />
    </div>
  );
}

function Container46() {
  return (
    <div className="bg-red-50 h-[46px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#ffc9c9] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[46px] items-start pb-px pt-[13px] px-[13px] relative w-full">
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[82px] items-start relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Container46 />
    </div>
  );
}

function ProjectProgressDetail22() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[224.5px] items-start left-[60px] top-[76px] w-[982px]" data-name="ProjectProgressDetail">
      <Container42 />
      <Container43 />
      <Container47 />
    </div>
  );
}

function CardContent3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1066px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[1066px]">
        <ProjectProgressDetail21 />
        <ProjectProgressDetail22 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="[grid-area:3_/_1] bg-red-50 box-border content-stretch flex flex-col items-start p-[2px] relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-2 border-[#ffc9c9] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent3 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[41.67%] left-1/2 right-[33.33%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-12.5%_-25.01%_-12.5%_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
            <path d="M1 1V7L5 9" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
            <path d={svgPaths.pb60700} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[24px] top-[4px]" data-name="Container">
      <Icon20 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[186.023px]" data-name="Heading 5">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1c398e] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[187px]">Tahap 4: Analisis Masalah</p>
    </div>
  );
}

function Badge10() {
  return (
    <div className="absolute bg-[#6a7282] h-[22px] left-[194.02px] rounded-[8px] top-px w-[139.375px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[139.375px]">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Sedang Mengerjakan</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <Heading5 />
      <Badge10 />
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Menganalisis akar permasalahan</p>
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[48px] items-start left-[36px] top-0 w-[982px]" data-name="Container">
      <Container49 />
      <Paragraph20 />
    </div>
  );
}

function ProjectProgressDetail23() {
  return (
    <div className="absolute h-[48px] left-[24px] top-[16px] w-[1018px]" data-name="ProjectProgressDetail">
      <Container48 />
      <Container50 />
    </div>
  );
}

function PrimitiveLabel10() {
  return (
    <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Hasil Pengerjaan:</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="bg-white h-[46px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[13px] not-italic text-[#364153] text-[14px] text-nowrap top-[13.5px] tracking-[-0.1504px] whitespace-pre">Sedang melakukan analisis mendalam tentang proses bisnis minimarket dan kebutuhan fitur sistem kasir.</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[70px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel10 />
      <Container51 />
    </div>
  );
}

function PrimitiveLabel11() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-0 w-[982px]" data-name="Primitive.label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">Status Pengerjaan:</p>
    </div>
  );
}

function Badge11() {
  return (
    <div className="absolute bg-[#6a7282] h-[22px] left-0 rounded-[8px] top-[26.5px] w-[139.375px]" data-name="Badge">
      <div className="h-[22px] overflow-clip relative rounded-[inherit] w-[139.375px]">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[9px] not-italic text-[12px] text-nowrap text-white top-[4px] whitespace-pre">Sedang Mengerjakan</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[48.5px] relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel11 />
      <Badge11 />
    </div>
  );
}

function ProjectProgressDetail24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[130.5px] items-start left-[60px] top-[76px] w-[982px]" data-name="ProjectProgressDetail">
      <Container52 />
      <Container53 />
    </div>
  );
}

function CardContent4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1066px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[1066px]">
        <ProjectProgressDetail23 />
        <ProjectProgressDetail24 />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="[grid-area:4_/_1] bg-gray-50 box-border content-stretch flex flex-col items-start p-[2px] relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-2 border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent4 />
    </div>
  );
}

function Container54() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[328.5px_404.5px_328.5px_minmax(0px,_1fr)] h-[1344px] relative shrink-0 w-full" data-name="Container">
      <Card1 />
      <Card2 />
      <Card3 />
      <Card4 />
    </div>
  );
}

function ProjectProgressDetail25() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[1384px] items-start relative shrink-0 w-full" data-name="ProjectProgressDetail">
      <Heading1 />
      <Container54 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-0 size-[20px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p12dcd500} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1020px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[1020px]">
        <Icon21 />
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[28px] not-italic text-[16px] text-neutral-950 text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">Feedback Guru</p>
      </div>
    </div>
  );
}

function ProjectProgressDetail26() {
  return (
    <div className="h-[20px] relative shrink-0 w-[1020px]" data-name="ProjectProgressDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[1020px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#364153] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Sintaks 1 sudah dikerjakan dengan baik. Harap segera revisi tahap 3 untuk menambahkan indikator yang lebih terukur.</p>
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="bg-blue-50 h-[124px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#bedbff] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[30px] h-[124px] items-start pl-[25px] pr-px py-[25px] relative w-full">
          <CardTitle1 />
          <ProjectProgressDetail26 />
        </div>
      </div>
    </div>
  );
}

function TabPanel() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1070px]" data-name="Tab Panel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[24px] h-full items-start relative w-[1070px]">
        <ProjectProgressDetail16 />
        <ProjectProgressDetail25 />
        <Card5 />
      </div>
    </div>
  );
}

function PrimitiveDiv2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[1070px]" data-name="Primitive.div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[32px] h-full items-start relative w-[1070px]">
        <TabList />
        <TabPanel />
      </div>
    </div>
  );
}

function Card6() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[1843px] items-start left-[32px] pl-[25px] pr-px py-[25px] rounded-[14px] top-[466px] w-[1120px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <PrimitiveDiv2 />
    </div>
  );
}

function ProjectProgressDetail27() {
  return (
    <div className="h-[2341px] relative shrink-0 w-full" data-name="ProjectProgressDetail">
      <Button />
      <Card />
      <Card6 />
    </div>
  );
}

export default function Guru() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="GURU" style={{ backgroundImage: "linear-gradient(116.829deg, rgb(239, 246, 255) 0%, rgb(255, 255, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <ProjectProgressDetail27 />
    </div>
  );
}
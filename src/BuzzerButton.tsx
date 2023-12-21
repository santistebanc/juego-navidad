function BuzzerButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="button cursor-pointer select-none rounded-full border-[1px]
  border-blue-400  bg-blue-500
  transition-all
  duration-150 [box-shadow:0_30px_0_0_#155ed4,0_40px_0_0_#1b70f841] active:translate-y-8
  active:border-b-[0px] active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
"
      style={{ width: '70dvw', height: '70dvw' }}
      onClick={onClick}
    >
      <svg height="100%" viewBox="0 0 512 512" width="100%" fill="#134fb0">
        <g>
          <path d="M381.7,225.9c0-97.6-52.5-130.8-101.6-138.2c0-0.5,0.1-1,0.1-1.6c0-12.3-10.9-22.1-24.2-22.1c-13.3,0-23.8,9.8-23.8,22.1   c0,0.6,0,1.1,0.1,1.6c-49.2,7.5-102,40.8-102,138.4c0,113.8-28.3,126-66.3,158h384C410.2,352,381.7,339.7,381.7,225.9z" />
          <path d="M256.2,448c26.8,0,48.8-19.9,51.7-43H204.5C207.3,428.1,229.4,448,256.2,448z" />
        </g>
      </svg>
    </div>
  );
}

export default BuzzerButton;

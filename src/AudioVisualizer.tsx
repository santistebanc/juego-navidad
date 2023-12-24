import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
interface Props {
  src: string;
  paused: boolean;
  reset: boolean;
}

const AudioVisualizer = ({ src, paused, reset }: Props) => {
  const canvasRef = useRef(null);

  const [context, setContext] = useState<AudioContext>();
  const [source, setSource] = useState<AudioBufferSourceNode>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const context = new window.AudioContext();
    const source = context.createBufferSource();
    setContext(context);
    setSource(source);
    return () => {
      context.close();
    };
  }, [reset]);

  const audioVisualizerLogic = () => {
    const canvas = canvasRef.current;

    //config canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    //config audio analyzer
    const analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount,
      dataArray = new Uint8Array(bufferLength),
      WIDTH = canvas.width,
      HEIGHT = canvas.height,
      barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight = null,
      x = null;

    //core logic for the visualizer
    const renderFrame = () => {
      ctx.fillStyle = "rgba(0,0,0,0)";
      requestAnimationFrame(renderFrame);
      x = 0;
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < bufferLength; i++) {
        //color based upon frequency
        barHeight = dataArray[i];
        let r = barHeight + 22 * (i / bufferLength),
          g = 333 * (i / bufferLength),
          b = 47;
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    renderFrame();
  };

  //connect audio visualizer to DOM and execute logic
  useEffect(() => {
    if (context && source && canvasRef.current) {
      fetch(src)
        .then((response) => response.arrayBuffer())
        .then((response) => {
          context.decodeAudioData(response, (buffer) => {
            setLoading(false);
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
            if (paused) {
              context.suspend();
            }
          });
        });
      audioVisualizerLogic();
    }
  }, [context, source, canvasRef.current]);

  useEffect(() => {
    if (paused && context?.state === "running") {
      context.suspend();
    } else {
      context?.resume();
    }
  }, [paused, context]);

  return (
    <>
      {loading && <Loading />}
      <canvas ref={canvasRef} className="canvas absolute left-0"></canvas>
    </>
  );
};

export default AudioVisualizer;

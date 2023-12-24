import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
interface Props {
  src: string;
  paused: boolean;
}

const AudioVisualizer = ({ src, paused }: Props) => {
  const canvasRef = useRef(null);

  const [context, setContext] = useState<AudioContext>();
  const [source, setSource] = useState<AudioBufferSourceNode>();
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const context = new window.AudioContext();
    const source = context.createBufferSource();
    setContext(context);
    setSource(source);
    return () => {
      context.close();
      timeouts.current.forEach((t) => {
        clearTimeout(t);
      });
    };
  }, []);

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
    timeouts.current = [];
    const renderFrame = () => {
      ctx.fillStyle = "rgba(0,0,0,0)";
      requestAnimationFrame(renderFrame);
      x = 0;
      analyser.getByteFrequencyData(dataArray);
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

        //Allows visualizer to overlay on a background/video by clearing the rects after painting.
        let timer = setTimeout(() => {
          ctx.clearRect(0, 0, WIDTH, HEIGHT);
        }, 50);
        timeouts.current.push(timer);
      }
    };
    //Clears the accumulating timeouts.
    setTimeout(() => {
      for (let i = 0; i < timeouts.current.length; i++) {
        return clearTimeout(timeouts.current[i]);
      }
    }, 51);
    renderFrame();
  };

  //connect audio visualizer to DOM and execute logic
  useEffect(() => {
    if (context && source) {
      fetch(src)
        .then((response) => response.arrayBuffer())
        .then((response) => {
          context.decodeAudioData(response, (buffer) => {
            setLoading(false);
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
            context.suspend();
          });
        });
      audioVisualizerLogic();
    }
  }, [context, source]);

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

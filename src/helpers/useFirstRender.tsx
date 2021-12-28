import { useRef, useEffect } from "react";

export default function useFirstRender(): boolean {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { socket } from '../../socket';
import { atomID, atomSD, atomUN } from '../../jotai';

export default function PickASide() {
  const [atomSide, setAtomSide] = useAtom(atomSD);

  useEffect(() => {}, [socket]);

  function pick(e: any) {
    const side = e.target.value;
    socket.emit('pickASide', {
      side: side,
    });
  }

  return (
    <div className="PickASide">
      <button value="X" onClick={(e) => pick(e)}>
        X
      </button>
      <button value="O" onClick={(e) => pick(e)}>
        O
      </button>
    </div>
  );
}

interface MainMenuProps {
  hasSave: boolean;
  onNewGame: () => void;
  onOpenSaved: () => void;
  onSounds: () => void;
}

export default function MainMenu({ hasSave, onNewGame, onOpenSaved, onSounds }: MainMenuProps) {
  return (
    <div className="menu-screen">
      <div className="menu-title-block">
        <h1 className="menu-title">Simsar Emlak</h1>
        <p className="menu-subtitle">İstanbul'un en... yaratıcı emlakçısı</p>
      </div>
      <nav className="menu-buttons">
        <button className="menu-btn" onClick={onNewGame}>
          Oyuna Başla
        </button>
        <button className="menu-btn" onClick={onOpenSaved} disabled={!hasSave}>
          Kayıtlı Oyunlar
        </button>
        <button className="menu-btn" onClick={onSounds}>
          Sesler
        </button>
      </nav>
    </div>
  );
}

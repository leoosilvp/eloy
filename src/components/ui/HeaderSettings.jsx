const HeaderSettings = ({ saveHandler, cancelHandler }) => {

  return (
    <section className="header-settings">
      <h1>Configurações</h1>
      <section className="btns-header-settings">
        <button onClick={cancelHandler}>Cancelar</button>
        <button className="active" onClick={saveHandler}>
          Salvar
        </button>
      </section>
    </section>
  );
};

export default HeaderSettings;

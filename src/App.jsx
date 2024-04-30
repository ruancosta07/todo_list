import { useEffect, useRef } from "react";
import { useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
function App() {
  const valorVazio = useRef();
  const setTime = useRef();
  const [modal, setModal] = useState(false);
  const [valorModal, setValorModal] = useState("");
  const [value, setValue] = useState("");
  const [valueVazio, setValueVazio] = useState(false);
  const [tarefas, setTarefas] = useState(
    JSON.parse(localStorage.getItem("tarefas")) || []
  );
  const date = new Date();
  const createdAt = {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: `${date.getFullYear()}`.slice(2),
  };

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  function criaTarefa() {
    if (value.length > 0) {
      setTarefas([...tarefas, { text: value, completed: false, createdAt }]);
      setValue("");
      setValueVazio(false);
      setTimeout(()=>{
        const elementoAdicionado = document.querySelectorAll('.tarefa-card')
        gsap.fromTo(elementoAdicionado[elementoAdicionado.length - 1], {opacity: 0, y:-12}, {opacity:1, y:0})
      })
    } else {
      setValueVazio(true);
      clearTimeout(setTime.current);
      setTimeout(()=>{
      gsap.fromTo(valorVazio.current, {opacity:0, right: '-200px',}, {opacity:1, right:32, duration:.65})
      })
      setTime.current = setTimeout(() => {
        gsap.to(valorVazio.current, {opacity:0, right: '-200px',})
      }, 5000);
    }
  }

  function deletaTarefa({ target }) {
    const input =
      target.parentElement.parentElement.querySelector('input[type="text"]');
      const divInput = target.parentElement.parentElement
    const tarefasFiltradas = tarefas.filter((item) => item.text != input.value);
    gsap.to(divInput, {opacity:0, x:32, duration: .15, onComplete: ()=> tarefasFiltradas.length == 0
      ? setTarefas([])
      : setTarefas(tarefasFiltradas)})
    
  }

  function completaTarefa({ target }) {
    const input = target.parentElement.querySelector('input[type="text"]');
    const updatedTarefas = tarefas.map((item) => {
      return item.text == input.value
        ? { ...item, completed: target.checked }
        : item;
    });
    setTarefas(updatedTarefas);
  }

  function salvaAlteracoes() {
    let inputEditarTarefa = document.querySelector(".tarefa-modal").value;
    let novasTarefas = tarefas.map((tarefa) => {
      if (tarefa.text === valorModal) {
        return { ...tarefa, text: inputEditarTarefa };
      } else {
        return tarefa;
      }
    });
    setTarefas(novasTarefas);
    setValorModal(inputEditarTarefa);
    setTimeout(()=> gsap.fromTo('.modal-editar-tarefa', {opacity:1, scale:1}, {scale:0,opacity:0, duration: .25, onComplete:()=>setModal(false)}))
    
  }

  function editarTarefa({ target }) {
    setTimeout(()=> gsap.fromTo('.modal-editar-tarefa', {opacity:0, scale:.6}, {opacity:1, scale:1, duration: .25}))
    const valorTarefa =
      target.parentElement.parentElement.querySelector(
        'input[type="text"]'
      ).value;
    setValorModal(valorTarefa);
    setModal(true);
  }

  useGSAP(()=>{
    const tl = gsap.timeline()
    tl.fromTo('[data-animate]', {opacity: 0, x: -32}, {opacity: 1, x:0, stagger:.1})
  }, [])

  return (
    <div className="flex flex-col items-center overflow-x-clip">
      <h1 className="text-[#fff] text-[4rem] font-semibold mt-12" data-animate>TodoList</h1>
      <div className="flex gap-3 mt-8 w-[40%]">
        <input
          type="text"
          value={value}
          onChange={({ target }) => setValue(target.value)}
          placeholder="Andar no parque"
          className="w-full placeholder:text-neutral-400 rounded-[4px]"
          data-animate
        />
        <button
          onClick={criaTarefa}
          className="flex gap-1 bg-zinc-50 text-[1.45rem] items-center px-6 py-3 rounded font-semibold text-zinc-900"
          data-animate
        >
          Adicionar <img src="add.svg" alt="" className="w-5" />
        </button>
      </div>
      {tarefas.map((item, index) => (
        <div key={`${item.text}${index}`} className="tarefa-card w-[40%]" data-animate>
          <input
            type="checkbox"
            name=""
            id={`${item.text}${index}`}
            checked={item.completed}
            onChange={completaTarefa}
          />
          <label
            htmlFor={`${item.text}${index}`}
            className="custom-input mr-3"
          ></label>
          <input
            type="text"
            defaultValue={item.text}
            className={`tarefa-adicionada text-gray-100 ${item.completed && 'line-through'}`}
            disabled
          />
          <div className="gap-1 flex">
            <img
              src="/edit.svg"
              onClick={editarTarefa}
              className="w-8 cursor-pointer"
              alt=""
            />
            <img
              src="/delete.svg"
              onClick={deletaTarefa}
              className="w-8 cursor-pointer"
              alt=""
            />
          </div>
          <div className="col-span-full  flex items-center gap-1 mt-2">
              <img src="date.svg" alt="" className="w-5" />
              <p className="text-[.85rem] text-[rgb(120,120,120)] mt-1 leading-none font-semibold">
                {item.createdAt.day}/{item.createdAt.month}/
                {item.createdAt.year}
              </p>
            </div>
        </div>
      ))}
      {/* {tarefas.map((item, index) => {
        return (
          <div className="tarefa-card w-[40%]" key={index}>
            <input
              type="checkbox"
              name=""
              id={`${item.text}${index}`}
              checked={item.completed}
              onChange={completaTarefa}
            />
            <label
              htmlFor={`${item.text}${index}`}
              className="custom-input mr-3"
            ></label>
            <input
              type="text"
              className={`w-full text-zinc-200 tarefa-adicionada ${
                item.completed && "line-through"
              }`}
              disabled
              defaultValue={item.text}
            />
            <div className="gap-1 flex">
              <img
                src="/edit.svg"
                onClick={editarTarefa}
                className="w-8 cursor-pointer"
                alt=""
              />
              <img
                src="/delete.svg"
                onClick={deletaTarefa}
                className="w-8 cursor-pointer"
                alt=""
              />
            </div>
            <div className="col-span-full  flex items-center gap-1 mt-2">
              <img src="date.svg" alt="" className="w-5" />
              <p className="text-[.85rem] text-[rgb(120,120,120)] mt-1 leading-none font-semibold">
                {item.createdAt.day}/{item.createdAt.month}/
                {item.createdAt.year}
              </p>
            </div>
          </div>
        );
      })} */}
      {valueVazio && (
        <div className="aviso-valor" ref={valorVazio}>
          <img src="error.svg" className="w-5" alt="" />
          <span className="text-[#fff] font-semibold">Campo vazio</span>
          <p className="text-gray-300 col-span-full">
            O campo de adicionar tarefas não pode ficar em branco.
          </p>
        </div>
      )}
      {modal && (
        <div className="bg-[#161616] opacity-0 modal-editar-tarefa border-2 border-zinc-800 w-[30%] flex flex-col fixed top-2/4 -translate-y-2/4 py-6 px-12 rounded-[8px] z-[2]">
          <div>
            <h1 className=" text-[#fff] text-[1.55rem] leading-none font-semibold">
              Editar tarefa
            </h1>
            <p className="text-gray-300 mb-3">
              Faça alterações na sua tarefa abaixo.
            </p>
            <input
              className="rounded-[4px] w-full tarefa-modal bg-[#fff]"
              type="text"
              defaultValue={valorModal}
              // onChange={({target})=> setValorModal(target.value)}
            />
          </div>
          <div className="mt-8 flex gap-3 ml-auto">
            <button
              onClick={() => setModal(false)}
              className="bg-zinc-900 text-zinc-50 border-2 border-zinc-800 px-3 py-2 rounded-[8px]"
            >
              Cancelar
            </button>
            <button
              onClick={salvaAlteracoes}
              className="px-3 py-2 bg-zinc-50 font-semibold text-[1rem] rounded-[8px]"
            >
              Salvar alterações
            </button>
          </div>
        </div>
      )}
      {modal && (
        <div className="bg-black opacity-15 fixed h-[100vh] w-[100vw]"></div>
      )}
    </div>
  );
}

export default App;

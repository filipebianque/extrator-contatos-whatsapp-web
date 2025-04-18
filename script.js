const contatosSet = new Set();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const scrollContainer = document.getElementById("pane-side");

const rolarEColetar = async () => {
  let prevTop = -1;
  let tentativasSemMudança = 0;

  while (tentativasSemMudança < 5) {
    document.querySelectorAll('span[dir="auto"]').forEach(el => {
      const texto = el.textContent.trim();
      if (/^\+55\s?\d{2}\s?\d{4,5}-\d{4}$/.test(texto)) {
        contatosSet.add(texto);
      }
    });

    scrollContainer.scrollBy(0, 200);
    await delay(600);

    const atualTop = scrollContainer.scrollTop;
    if (atualTop === prevTop) {
      tentativasSemMudança++;
    } else {
      tentativasSemMudança = 0;
      prevTop = atualTop;
    }
  }

  const contatosArray = Array.from(contatosSet);
  console.log("✅ Total de contatos únicos:", contatosArray.length);
  console.log(contatosArray.join('\n'));

  const csv = "Número\n" + contatosArray.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "contatos.csv";
  a.click();
};

rolarEColetar();

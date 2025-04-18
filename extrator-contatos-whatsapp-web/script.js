// Cria um Set para armazenar os números únicos sem duplicidade
const contatosSet = new Set();

// Função de delay (pausa) para aguardar carregamento entre os scrolls
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Seleciona o container correto da lista lateral do WhatsApp Web
const scrollContainer = document.getElementById("pane-side");

// Função principal que rola a lista e extrai os contatos
const rolarEColetar = async () => {
  let prevTop = -1; // Posição anterior do scroll
  let tentativasSemMudança = 0; // Tentativas em que o scroll não mudou

  // Continua tentando enquanto o scroll estiver mudando
  while (tentativasSemMudança < 5) {
    // Para cada elemento visível na lista lateral...
    document.querySelectorAll('span[dir="auto"]').forEach(el => {
      const texto = el.textContent.trim();

      // Verifica se o texto tem formato de número com DDD brasileiro
      if (/^\+55\s?\d{2}\s?\d{4,5}-\d{4}$/.test(texto)) {
        contatosSet.add(texto); // Adiciona ao Set (sem duplicatas)
      }
    });

    // Rola suavemente 200px para baixo
    scrollContainer.scrollBy(0, 200);

    // Aguarda 600ms para permitir que o conteúdo carregue
    await delay(600);

    // Verifica se o scroll realmente mudou
    const atualTop = scrollContainer.scrollTop;
    if (atualTop === prevTop) {
      tentativasSemMudança++; // Parou de carregar novos contatos
    } else {
      tentativasSemMudança = 0; // Ainda está carregando
      prevTop = atualTop;
    }
  }

  // Transforma o Set em array para exportar
  const contatosArray = Array.from(contatosSet);

  // Exibe no console o total de contatos encontrados
  console.log("✅ Total de contatos únicos:", contatosArray.length);
  console.log(contatosArray.join('\n'));

  // Gera o conteúdo do arquivo CSV
  const csv = "Número\n" + contatosArray.join("\n");

  // Cria um Blob (arquivo em memória) com o conteúdo CSV
  const blob = new Blob([csv], { type: "text/csv" });

  // Gera uma URL temporária para o arquivo
  const url = URL.createObjectURL(blob);

  // Cria um link oculto para fazer o download
  const a = document.createElement("a");
  a.href = url;
  a.download = "contatos.csv"; // Nome do arquivo que será baixado
  a.click(); // Simula clique para iniciar o download
};

// Inicia o processo
rolarEColetar();

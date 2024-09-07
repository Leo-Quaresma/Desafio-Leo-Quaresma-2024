class RecintosZoo {
    constructor()
    {
        // Definir os recintos existentes
        this.recintos =
        [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3, tamanho: 1 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1, tamanho: 2 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1, tamanho: 3 }] }
        ];

        // Definir os animais permitidos
        this.animaisPermitidos =
        {
            'LEAO': { tamanho: 3, bioma: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, bioma: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, bioma: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, bioma: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        };
    }

    // Valida se o animal é permitido
    validaAnimal(animal)
    {
        return this.animaisPermitidos.hasOwnProperty(animal.toUpperCase());
    }

    // Valida se a quantidade é válida
    validaQuantidade(quantidade)
    {
        return Number.isInteger(quantidade) && quantidade > 0;
    }

    analisaRecintos(animal, quantidade) {
        // Valida o animal
        if (!this.validaAnimal(animal)) {
            return { erro: "Animal inválido" };
        }
    
        // Valida a quantidade
        if (!this.validaQuantidade(quantidade)) {
            return { erro: "Quantidade inválida" };
        }
    
        const infoAnimal = this.animaisPermitidos[animal.toUpperCase()];
        const recintosViaveis = [];
    
        // Verifica os recintos
        this.recintos.forEach(recinto => {
            // Verifica se o bioma do recinto é compatível com o bioma do animal
            const temBiomasCompativeis = infoAnimal.bioma.some(bioma => recinto.bioma.includes(bioma));
            if (!temBiomasCompativeis) {
                return;
            }
    
            // Verifica se o recinto já contém animais
            const possuiAnimais = recinto.animais.length > 0;
    
            // Verifica se o novo animal é carnívoro
            if (infoAnimal.carnivoro) {
                // Verifica se o recinto já tem carnívoros e se todos são da mesma espécie
                const carnívorosPresentes = recinto.animais.every(animalPresente => {
                    const infoAnimalPresente = this.animaisPermitidos[animalPresente.especie.toUpperCase()];
                    return infoAnimalPresente.carnivoro && animalPresente.especie.toUpperCase() === animal.toUpperCase();
                });
    
                if (!carnívorosPresentes) {
                    return; // Não pode adicionar carnívoros se já há outros carnívoros de espécies diferentes
                }
            } else {
                // Verifica se há carnívoros no recinto e o novo animal não é carnívoro
                const carnívorosPresentes = recinto.animais.some(animalPresente => {
                    const infoAnimalPresente = this.animaisPermitidos[animalPresente.especie.toUpperCase()];
                    return infoAnimalPresente.carnivoro;
                });
    
                if (carnívorosPresentes) {
                    return; // Não pode adicionar um não carnívoro se já há carnívoros
                }
            }
    
            // Verifica a tolerância dos hipopótamos
            const temHipopotamos = recinto.animais.some(animalPresente => animalPresente.especie.toUpperCase() === 'HIPOPOTAMO');
            if (temHipopotamos && !infoAnimal.bioma.includes('savana') && !infoAnimal.bioma.includes('rio')) {
                return; // Hipopótamos só toleram outras espécies em savana e rio
            }
    
            // Verifica se o macaco se sente confortável (deve haver outro animal no recinto)
            if (animal.toUpperCase() === 'MACACO' && !possuiAnimais && quantidade < 2) {
                return; // Macaco precisa de pelo menos um outro animal no recinto
            }
            
            // Calcula o espaço ocupado pelos animais no recinto
            const espacoOcupado = recinto.animais.reduce((total, animalPresente) => total + (animalPresente.tamanho * animalPresente.quantidade), 0);

            // Adiciona espaço extra se houver mais de uma espécie no recinto
            const temEspeciesDiferentes = recinto.animais.some(animalPresente => animalPresente.especie !== animal.toUpperCase());
            const espacoExtra = temEspeciesDiferentes ? 1 : 0;
    
            // Calcula o espaço restante
            const espacoRestante = recinto.tamanho - (espacoOcupado + espacoExtra);
    
            // Verifica se o recinto tem espaço suficiente para o novo animal
            if (espacoRestante >= infoAnimal.tamanho * quantidade) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante - (infoAnimal.tamanho * quantidade)} total: ${recinto.tamanho})`);
            }
        });
    
        // Se não houver recintos viáveis
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }
    
        // Retorna os recintos viáveis
        return { recintosViaveis };
    }
    
}

export { RecintosZoo as RecintosZoo };

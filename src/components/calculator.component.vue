<script setup>
import {EquipmentEnum} from "@/enums/equipment.enum.ts";
import {computed, ref, watch} from "vue";
import {CalculatorModel} from "@/models/calculator.model.ts";
import {PaymentTypeEnum} from "@/enums/paymentType.enum.ts";
import {PromocodeEnum} from "@/enums/promocode.enum.ts";
import {Formatter} from "@/utils/formatter.util.ts";
import {NumberValidator} from "@/utils/numberValidator.util.ts";
import {OtherConsumptionEnum} from "@/enums/otherConsumptionEnum.js";

defineOptions({
  name: "calculator-component"
})

const calculatorModel = ref(new CalculatorModel());

/*Select Options*/
const ccrEquipmentArray = Object.entries(EquipmentEnum).map(([key, data]) => ({ value: key, label: data.label}));
const paymentTypesArray = Object.values(PaymentTypeEnum).map(payment => ({ value: payment, label: payment }));
const promocodeArray = Object.entries(PromocodeEnum).map(([key,data]) => ({ value: key, label: data.num}));

/*CCR Data*/
const ccrListPrice = computed(() => EquipmentEnum[calculatorModel.value.equipment]?.ccrPrice || 0);
const ccrActualListPrice = computed(() => ccrListPrice.value * (1 - (calculatorModel.value.discountCCR/100)));
const ccrDiscount = computed(() => (calculatorModel.value.discountCCR / 100) * ccrListPrice.value);

/*New Equipment Data*/
const newListPrice = computed(() => EquipmentEnum[calculatorModel.value.equipment]?.newPrice || 0);
const newActualPrice = computed(() => newListPrice.value + newInterestRateValue.value - newDiscount.value);
const newDiscount = computed(() => (calculatorModel.value.discountNew / 100) * newListPrice.value);
const newInterestRatePercentage = computed(() => calculatorModel.value.paymentTypeNew === PaymentTypeEnum.CREDIT ? calculatorModel.value.interestRate : 0);
const newInterestRateValue = computed(() => (calculatorModel.value.paymentTypeNew === PaymentTypeEnum.CREDIT)? (newListPrice.value - newDiscount.value) * (newInterestRatePercentage.value / 100) : 0);

/*Summary Capex Data*/
const preliminarySavings = computed(() => newActualPrice.value - ccrActualListPrice.value);
const savingPercentage = computed(() => (ccrActualListPrice.value / newActualPrice.value) * 100);

/*Capex Data*/
const capexCcrActualPrice = computed(() => `Precio CCR - ${EquipmentEnum[calculatorModel.value.equipment]?.label || ""}: ${Formatter.currency(ccrActualListPrice.value)}`);
const capexCcrListPrice = computed(() => `Precio de Lista: ${Formatter.currency(ccrListPrice.value)}`);
const capexCcrInterestRate = computed(() => "Tasa de interés: 0%");
const capexCcrDiscount = computed(() => `Descuento: ${Formatter.currency(ccrDiscount.value)}`);

const capexNewListPrice = computed(() => `Precio de Lista: ${Formatter.currency(newListPrice.value)}`);
const capexNewActualPrice = computed(() => `Precio Nuevo - ${EquipmentEnum[calculatorModel.value.equipment]?.label || ""}: ${Formatter.currency(newActualPrice.value)}`);
const capexNewInterestRate = computed(() => `Tasa de interés: ${newInterestRatePercentage.value}% (${Formatter.currency(newInterestRateValue.value)})`);
const capexNewDiscount = computed(() => `Descuento: ${Formatter.currency(newDiscount.value)}`);

const capexPreliminarySavings = computed(() => `Ahorro Preliminar: ${Formatter.currency(preliminarySavings?.value || 0)}`);
const capexSavingPercentage = computed(() => `Ahorro en Porcentaje: ${Formatter.percentage(savingPercentage?.value || 0)}`);

/*Summary Opex Data*/
const warranty = computed(() => EquipmentEnum[calculatorModel.value.equipment]?.epp);
const cva500 = computed(() => EquipmentEnum[calculatorModel.value.equipment]?.cva500);
const mantto = computed(() => {
  const promocode = PromocodeEnum[calculatorModel.value.promocode]?.num;
  const excavators = EquipmentEnum['D320'].difference * promocode * calculatorModel.value.numExcavator;
  const retroExcavators = EquipmentEnum['F420'].difference * promocode * calculatorModel.value.numRetroExcavator;
  const skidSteer = EquipmentEnum['D246'].difference * promocode * calculatorModel.value.numSkidSteer;
  const currentDifference = EquipmentEnum[calculatorModel.value.equipment]?.difference * promocode;
  return excavators + retroExcavators + skidSteer + currentDifference;
});
const repairPartsDiscount = computed(() => {
  const equipmentSum = calculatorModel.value.numExcavator + calculatorModel.value.numRetroExcavator + calculatorModel.value.numSkidSteer;
  const promocode = PromocodeEnum[calculatorModel.value.promocode]?.num;
  const otherConsumption = OtherConsumptionEnum['MONTHLY_LIST_PRICE'].price - OtherConsumptionEnum['MONTHLY_VV_DISCOUNT'].price;
  return equipmentSum * promocode * otherConsumption;
});
const cut = computed(() => {
  const promocode = PromocodeEnum[calculatorModel.value.promocode]?.num;
  const excavators = EquipmentEnum['D320'].difference2 * promocode * calculatorModel.value.numExcavator;
  const retroExcavators = EquipmentEnum['F420'].difference2 * promocode * calculatorModel.value.numRetroExcavator;
  const skidSteer = EquipmentEnum['D246'].difference2 * promocode * calculatorModel.value.numSkidSteer;
  const frontLoader = EquipmentEnum['K938'].difference2 * promocode * calculatorModel.value.numFrontLoader;
  const currentDifference = EquipmentEnum[calculatorModel.value.equipment]?.difference2 * promocode;
  return excavators + retroExcavators + skidSteer + frontLoader + currentDifference;
});
const sumOfBenefits = computed(() => (warranty.value + cva500.value + mantto.value + repairPartsDiscount.value + cut.value));
const totalSavings = computed(() => preliminarySavings.value + sumOfBenefits.value);

/*Opex Data*/
const opexWarranty = computed(() => `Garantía extendida de 2 años: ${Formatter.currency(warranty?.value || 0)}`);
const opexCva500 = computed(() => `CVA 500+ (2 eventos): ${Formatter.currency(cva500?.value || 0)}`);
const opexMantto = computed(() => `Descuento de Partes de Mantto: ${Formatter.currency(mantto?.value || 0) }`);
const opexRepairPartsDiscount = computed(() => `Descuento de Partes de Reparación: ${Formatter.currency(repairPartsDiscount?.value || 0)}`);
const opexCut = computed(() => `Descuento de H. Corte: ${Formatter.currency(cut?.value|| 0)}`);
const opexSumOfBenefits = computed(() => `Total de Beneficio por Otros Ahorros: ${Formatter.currency(sumOfBenefits?.value || 0)}`);
const opexTotalSavings = computed(() => `Ahorro Total: ${Formatter.currency(totalSavings?.value || 0)}`);
/*Graph*/
const graphData = ref();
const graphOptions = ref();

watch(preliminarySavings, () => {
  graphData.value = setChartData(ccrListPrice.value, newListPrice.value, newInterestRateValue.value);
  graphOptions.value = setChartOptions();
});

const setChartData = (ccrListPrice, newListPrice, newInterestRateValue) => ({
  labels: ['CCR', 'Equipo Nuevo'],
  datasets: [
    {
      type: 'bar',
      label: 'Precio',
      backgroundColor: 'rgba(255,201,0,0.3)',
      borderColor: 'rgb(255,197,0)',
      borderWidth: 1,
      data: [ccrListPrice, newListPrice],
    },
    {
      type: 'bar',
      label: 'Crédito',
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'rgb(255,0,0)',
      borderWidth: 1,
      data: [0, newInterestRateValue]
    }
  ]
});

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  return {
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false
      },
      legend: {
        labels: {
          color: 'rgb(0,0,0)'
        }
      }
    },
    scales: {
      x: { stacked: true, ticks: { color: documentStyle.getPropertyValue('--p-text-muted-color') } },
      y: { stacked: true, beginAtZero: true, ticks: { color: documentStyle.getPropertyValue('--p-text-muted-color') } }
    }
  };
};
</script>

<template>
  <div class="background">
    <nav>
      <h2 style="font-size: xx-large">UNIMAQ</h2>
    </nav>
    <main class="content">
      <aside class="data-side">
        <article class="data-container">
          <h3 class="data-title">DATOS DE EQUIPO Y FLOTA</h3>
          <div class="data-form">
            <div class="form-item">
              <label>Equipo para CCR</label>
              <select id="ccr-equipment" v-model="calculatorModel.equipment" class="input-field">
                <option v-for="ccr in ccrEquipmentArray" :key="ccr.value" :value="ccr.value">
                  {{ccr.label}}
                </option>
              </select>
              <label>Serie</label>
              <input type="text" class="input-field" />
            </div>
            <h4 class="form-subtitle">Cantidad de Parque Mod</h4>
            <div class="form-park-mod-grid">
              <label>Excavadora</label>
              <input type="number" min="0" step="1" class="input-field" @input="calculatorModel.numExcavator = NumberValidator.validateInterval($event.target.value)"
                     v-model="calculatorModel.numExcavator"/>
              <label>Mini Cargador</label>
              <input type="number" min="0" step="1" class="input-field" @input="calculatorModel.numSkidSteer = NumberValidator.validateInterval($event.target.value)"
                     v-model="calculatorModel.numSkidSteer"/>
              <label>Retro Excavadora</label>
              <input type="number" min="0" step="1" class="input-field" @input="calculatorModel.numRetroExcavator = NumberValidator.validateInterval($event.target.value)"
                     v-model="calculatorModel.numRetroExcavator" />
              <label>Cargador Frontal</label>
              <input type="number" min="0" step="1" class="input-field" @input="calculatorModel.numFrontLoader = NumberValidator.validateInterval($event.target.value)"
                     v-model="calculatorModel.numFrontLoader"/>
            </div>
          </div>
        </article>
        <article class="data-container">
          <h3 class="data-title">DESCUENTO Y FINANCIAMIENTO</h3>
          <div class="dscto-finz-grid">
            <!--Row 1-->
            <div></div>
            <h5 style="text-align: center">CCR - {{ EquipmentEnum[calculatorModel.equipment]?.label }}</h5>
            <h5 style="text-align: center">Equipo Nuevo</h5>
            <!--Row 2-->
            <label> Descuento </label>
            <input type="number" min="0" max="100" step="1" class="input-field" @input="calculatorModel.discountCCR = NumberValidator.validateInterval($event.target.value)"
                   v-model="calculatorModel.discountCCR"/>
            <input type="number" min="0" max="100" step="1" class="input-field" @input="calculatorModel.discountNew = NumberValidator.validateInterval($event.target.value)"
                   v-model="calculatorModel.discountNew"/>
            <!--Row 3-->
            <label> Medio de Pago </label>
            <select id="payment-types-ccr" v-model="calculatorModel.paymentTypeCCR" class="input-field">
              <option v-for="payment in paymentTypesArray" :key="payment.value" :value="payment.value">
                {{payment.label}}
              </option>
            </select>
            <select id="payment-types-new" v-model="calculatorModel.paymentTypeNew" class="input-field">
              <option v-for="payment in paymentTypesArray" :key="payment.value" :value="payment.value">
                {{payment.label}}
              </option>
            </select>
            <!--Row 4-->
            <div></div>
            <label class="tasa-utilizada"> Tasa Utilizada </label>
            <input type="number" v-model="calculatorModel.interestRate" class="input-field" />
            <label class="full-width"> Validez de Promocode </label>
            <select  id="val-promo-select" v-model="calculatorModel.promocode" class="input-field">
              <option v-for="promo in promocodeArray" :key="promo.value" :value="promo.value">
                {{promo.label}}
              </option>
            </select>
          </div>
        </article>
      </aside>
      <aside class="benefits-side">
        <div>
          <div class="capex">
            <header>
              <h1>Ahorro en Capex</h1>
            </header>
            <main>
              <div>
                <details>
                  <summary>{{capexCcrActualPrice}}</summary>
                  <p>{{ capexCcrListPrice }}</p>
                  <p>{{capexCcrInterestRate}}</p>
                  <p>{{capexCcrDiscount}}</p>
                </details>
                <details>
                  <summary>{{capexNewActualPrice}}</summary>
                  <p>{{ capexNewListPrice }}</p>
                  <p>{{capexNewInterestRate}}</p>
                  <p>{{capexNewDiscount}}</p>
                </details>
              </div>
              <h1>{{capexPreliminarySavings}}</h1>
              <p>{{capexSavingPercentage}}</p>
            </main>
          </div>
          <div class="divider"></div>
          <div class="opex">
            <header>
              <h1>Ahorro en Opex</h1>
            </header>
            <main>
              <aside>
                <div>
                  <h5>{{opexWarranty}}</h5>
                  <h5>{{opexCva500}}</h5>
                  <h5>{{opexMantto}}</h5>
                  <h5>{{opexRepairPartsDiscount}}</h5>
                  <h5>{{opexCut}}</h5>
                  <div class="divider"></div>
                  <h5>{{opexSumOfBenefits}}</h5>
                </div>
              </aside>
              <aside>
                <pv-chart type="bar" :data="graphData" :options="graphOptions"/>
                <h5>{{opexTotalSavings }}</h5>
              </aside>
            </main>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.background{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav{
  width: 100vw;
  background: linear-gradient(to right, #B61D1F 0%, #B61D1F 70%, #E1B524 70%, #E1B524 100%);
  border-bottom: 4px solid black;
  color: white;
}

nav>h2{
  padding: 0.4rem;
}

.content{
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 5rem;
  margin: 1rem;
}

.data-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 40%;
}

.data-container{
  padding: 1rem;
  border: 5px solid var(--unimaq-dark-color);
  border-radius: 10px;
  box-shadow: inset 0 0 10px 1px rgba(0, 0, 0, 0.4), 4px 2px 4px 0 rgba(0,0,0,0.3);
  color: white;
  background-color: var(--unimaq-color);
}

.data-title{
  text-align: center;
  font-weight: bolder;
  margin-bottom: 1rem;
}

.form-item{
  display: grid;
  grid-template-columns: 40% 60%;
  row-gap: 1rem;
  align-items: center;
  justify-content: center;
}

label{
  text-align: right;
  margin-right: 1rem;
  font-weight: bold;
}

input, select{
  width: 100%;
  padding: 0.2rem;
  border-radius: 4px;
  border: 3px solid var(--gray-color);
}

input{
  height: 30px;
  transition: scale 0.1s ease-in-out, border 0.2s ease-in-out;
}

input:focus{
  outline: none;
  border: 3px solid var(--gray-color-hover);
  scale: 1.02;
}

select{
  transition: border 0.2s ease-in-out;
}

select:focus{
  border: 3px solid var(--gray-color-hover);
}

.form-subtitle{
  margin: 1rem 0 1rem 0;
}

.form-park-mod-grid{
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 30% 20% 30% 20%;
  row-gap: 1rem;
}

.dscto-finz-grid{
  display: grid;
  grid-template-columns: 30% 35% 35%;
  align-items: center;
  justify-content: center;
  row-gap: 0.5rem;
  column-gap: 0.4rem;
}

.tasa-utilizada{
  grid-column-start: 1;
  grid-column-end: 3;
}

#val-promo-select{
  grid-column-start: 2;
  grid-column-end: 4;
}

.benefits-side{
  width: 60%;
}

.divider{
  width: 100%;
  background-color: var(--gray-color);
  height: 2px;
  margin-top: 1rem;
}

.capex, .opex{
  display: flex;
  flex-direction: column;
}

.capex>header, .opex>header{
  padding: 1rem;
  text-align: center;
}

.capex>main{
  display: flex;
  flex-direction: column;
}

.capex>main>div{
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 1rem;
}

.opex>main{
  display: grid;
  grid-template-columns: 40% 60%;
}

@media (max-width: 900px) {
  .content{
    flex-direction: column;
  }

  .data-side, .benefits-side{
    width: 100%;
  }
}
</style>
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
const capexCcrActualPrice = computed(() => Formatter.currency(ccrActualListPrice.value));
const capexCcrListPrice = computed(() => Formatter.currency(ccrListPrice.value));
const capexCcrInterestRate = computed(() => "Tasa de interés: 0%");
const capexCcrDiscount = computed(() => `Descuento: ${Formatter.currency(ccrDiscount.value)}`);

const capexNewActualPrice = computed(() => Formatter.currency(newActualPrice.value));
const capexNewListPrice = computed(() => Formatter.currency(newListPrice.value));
const capexNewInterestRate = computed(() => Formatter.currency(newInterestRateValue.value));
const capexNewDiscount = computed(() => `Descuento: ${Formatter.currency(newDiscount.value)}`);

const capexPreliminarySavings = computed(() => Formatter.currency(preliminarySavings?.value || 0));
const capexSavingPercentage = computed(() => Formatter.percentage(savingPercentage?.value || 0));

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
const opexWarranty = computed(() => Formatter.currency(warranty?.value || 0));
const opexCva500 = computed(() => Formatter.currency(cva500?.value || 0));
const opexMantto = computed(() => Formatter.currency(mantto?.value || 0));
const opexRepairPartsDiscount = computed(() => Formatter.currency(repairPartsDiscount?.value || 0));
const opexCut = computed(() => Formatter.currency(cut?.value|| 0));
const opexSumOfBenefits = computed(() => Formatter.currency(sumOfBenefits?.value || 0));
const opexTotalSavings = computed(() => Formatter.currency(totalSavings?.value || 0));
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
      <h1 class="nav-bar-title">UNIMAQ</h1>
    </nav>
    <main class="content">
      <aside class="data-side">
        <article class="data-container equipment-data">
          <h3 class="data-title">DATOS DE EQUIPO Y FLOTA</h3>
          <div class="data-form">
            <section class="form-grid-equipment">
              <pv-float-label variant="on">
                <pv-select id="select-equipment" v-model="calculatorModel.equipment" size="small" style="width: 100%"
                           :options="ccrEquipmentArray" optionLabel="label" optionValue="value" />
                <label for="select-equipment">Equipo para CCR</label>
              </pv-float-label>
              <pv-float-label variant="on">
                <pv-input id="input-series-number" type="text" size="small" v-model="calculatorModel.serie" style="width: 100%"/>
                <label for="input-series-number" size="small">Número de Serie</label>
              </pv-float-label>
            </section>
            <h4 class="form-subtitle">Cantidad de Parque Mod</h4>
            <section class="form-grid-park">
              <pv-float-label variant="on">
                <pv-input id="input-excavator" type="number" min="0" step="1" v-model="calculatorModel.numExcavator" style="width: 100%"
                          @input="calculatorModel.numExcavator = NumberValidator.validateInterval($event.target.value)"></pv-input>
                <label for="input-excavator">Excavadora</label>
              </pv-float-label>
              <pv-float-label variant="on">
                <pv-input id="input-retro-excavator" type="number" min="0" step="1" v-model="calculatorModel.numRetroExcavator" style="width: 100%"
                          @input="calculatorModel.numRetroExcavator = NumberValidator.validateInterval($event.target.value)"></pv-input>
                <label for="input-retro-excavator">Retro Excavadora</label>
              </pv-float-label>
              <pv-float-label variant="on">
                <pv-input id="input-skid-steer" type="number" min="0" step="1" v-model="calculatorModel.numSkidSteer" style="width: 100%"
                          @input="calculatorModel.numSkidSteer = NumberValidator.validateInterval($event.target.value)"></pv-input>
                <label for="input-skid-steer">Mini Cargador</label>
              </pv-float-label>
              <pv-float-label variant="on">
                <pv-input id="input-front-loader" type="number" min="0" step="1" v-model="calculatorModel.numFrontLoader" style="width: 100%"
                          @input="calculatorModel.numFrontLoader = NumberValidator.validateInterval($event.target.value)"/>
                <label for="input-front-loader">Cargador Frontal</label>
              </pv-float-label>
            </section>
          </div>
        </article>
        <article class="data-container price-data">
          <h3 class="data-title">COMPARATIVA DE PRECIOS</h3>
          <div class="dscto-finz-grid">
            <!--Row 1-->
            <div class="dscto-finz-grid-singular-row"></div>
            <h4 class="form-sub-subtitle">CCR - {{ EquipmentEnum[calculatorModel.equipment]?.label }}</h4>
            <h4 class="form-sub-subtitle">Equipo Nuevo</h4>
            <!--Row 2-->
            <h4 class="dscto-finz-grid-singular-row">Precio de Lista</h4>
            <h4 class="price">{{capexCcrListPrice}}</h4>
            <h4 class="price">{{capexNewListPrice}}</h4>
            <!--Row 3-->
            <h4 class="dscto-finz-grid-singular-row"> Descuento (%)</h4>
            <pv-float-label variant="on">
              <pv-input type="number" min="0" max="100" step="1" v-model="calculatorModel.discountCCR" style="width: 100%"
                        @input="calculatorModel.discountCCR = NumberValidator.validateInterval($event.target.value)"/>
            </pv-float-label>
            <pv-float-label variant="on">
              <pv-input type="number" min="0" max="100" step="1" v-model="calculatorModel.discountNew" style="width: 100%"
                        @input="calculatorModel.discountNew = NumberValidator.validateInterval($event.target.value)"/>
            </pv-float-label>
            <!--Row 4-->
            <h4 class="dscto-finz-grid-singular-row"> Medio de Pago </h4>
            <pv-select v-model="calculatorModel.paymentTypeCCR" size="small" style="width: 100%"
                       :options="paymentTypesArray" option-label="label" optionValue="value"/>
            <pv-select v-model="calculatorModel.paymentTypeNew" size="small" style="width: 100%"
                       :options="paymentTypesArray" option-label="label" optionValue="value"/>
            <!--Row 5-->
            <h4 class="dscto-finz-grid-singular-row"> Tasa Utilizada </h4>
            <div></div>
            <pv-input type="number" v-model="calculatorModel.interestRate"/>
            <!--Row 6-->
            <h4 class="dscto-finz-grid-singular-row">Tasa en Dólares</h4>
            <div></div>
            <h4 class="price">{{capexNewInterestRate}}</h4>
            <!--Row 7-->
            <h4 class="dscto-finz-grid-singular-row">Validez de Promocode</h4>
            <div class="promocode">
              <pv-float-label variant="on">
                <pv-select id="val-promo-select" v-model="calculatorModel.promocode"
                           :options="promocodeArray" optionLabel="label" optionValue="value" style="width: 100%"></pv-select>
                <label for="val-promo-select">Meses</label>
              </pv-float-label>
            </div>
          </div>
        </article>
      </aside>
      <aside class="benefits-side">
        <article>
          <div class="capex">
            <h3 class="data-title">AHORRO EN CAPEX</h3>
            <main>
              <div class="capex-price">
                <h3 class="capex-label">CCR - {{ EquipmentEnum[calculatorModel.equipment]?.label }}</h3>
                <h3>{{capexCcrActualPrice}}</h3>
              </div>
              <div class="capex-price">
                <h3 class="capex-label">EQUIPO NUEVO</h3>
                <h3>{{capexNewActualPrice}}</h3>
              </div>
              <div class="capex-price preliminary-savings">
                <h1 class="capex-savings-label">Ahorro Preliminar</h1>
                <div class="capex-saving-info-label">
                  <h3 style="color: var(--green-color)">{{capexPreliminarySavings}}</h3> <h3>{{capexSavingPercentage}}</h3>
                </div>
              </div>
            </main>
          </div>
          <div class="divider"></div>
          <div class="opex">
            <h1 class="data-title">AHORRO EN OPEX</h1>
            <main>
              <aside class="opex-info-side">
                <div class="opex-grid">
                  <p>Garantía extendida de 2 años:</p> <p>{{opexWarranty}}</p>
                  <p>CVA 500+ (2 eventos):</p> <p>{{opexCva500}}</p>
                  <p>Descuento de Partes de Mantto:</p> <p>{{opexMantto}}</p>
                  <p>Descuento de Partes de Reparación:</p> <p>{{opexRepairPartsDiscount}}</p>
                  <p>Descuento de H. Corte:</p> <p>{{opexCut}}</p>
                  <div class="divider" id="opex-grid-divider"></div>
                  <p>Total de Beneficio por Otros Ahorros:</p> <p>{{opexSumOfBenefits}}</p>
                  <small style="grid-column: 1 / span 2; font-size: x-small">*Garantía extendida 24 meses / 4000 horas a Tren de Fuerza y Sistema Hidráulico</small>
                </div>
              </aside>
              <aside class="opex-summary-side">
                <section class="opex-info-promocode">
                  <p>Por el promocode:</p>
                  <p>25% Descuento Repuestos CAT</p>
                  <p>45% Descuento H. Corte CAT</p>
                  <p>20% Descuento Lubricantes CAT</p>
                </section>
                <section class="opex-info-graph">
                  <pv-chart type="bar" :data="graphData" :options="graphOptions"/>
                </section>
                <section class="opex-info-savings">
                  <h5 style="background-color: black; padding: 0.2rem">AHORRO TOTAL</h5>
                  <h5 style="background-color: var(--unimaq-color); padding: 0.8rem">{{opexTotalSavings }}</h5>
                </section>
              </aside>
            </main>
          </div>
        </article>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.background{
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav{
  width: 100%;
  background: linear-gradient(to right, #B61D1F 0%, #B61D1F 70%, #E1B524 70%, #E1B524 100%);
  border-bottom: 4px solid black;
  color: white;
}

.nav-bar-title{
  font-size: xx-large;
  padding: 0.5rem;
}

.content{
  width: 90%;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin: 1rem;
}

.data-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 45%;
}

.data-container{
  padding: 1rem;
  border-radius: 10px;
  box-shadow: inset 0 0 4px 2px rgba(0, 0, 0, 0.2), 4px 4px 4px 0 rgba(0,0,0,0.2);
  color: white;
}

.equipment-data{
  border: 5px solid var(--unimaq-dark-color);
  background-color: var(--unimaq-color);
}

.price-data{
  border: 5px solid var(--cat-dark-color);
  background-color: var(--cat-color);
}

.data-title{
  text-align: center;
  font-weight: bolder;
  margin-bottom: 1rem;
  color: white;
  font-size: x-large;
  font-family: "Arial Black",sans-serif;
  -webkit-text-stroke: 1px black;
}

.form-grid-equipment{
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
}

.form-grid-park{
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.form-subtitle{
  margin: 1rem 0 1rem 0;
  font-size: large;
  font-weight: bolder;
  -webkit-text-stroke: 1px black;
}

.dscto-finz-grid{
  display: grid;
  grid-template-columns: 30% 35% 35%;
  align-items: center;
  justify-content: center;
  row-gap: 0.5rem;
  column-gap: 0.4rem;
  color: #393939;
}


.form-sub-subtitle,.price{
  color: white;
  text-align: center;
}

.form-sub-subtitle{
  -webkit-text-stroke: 1px black;
}

.promocode{
  grid-column: 2 / span 2;
}

.benefits-side{
  width: 55%;
}

.benefits-side>article {
  background-color: white;
  padding: 1rem;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.4);
}

.capex{
  margin-bottom: 1rem;
}

.capex>main{
  display: grid;
  grid-template-columns: 25% 25% 50%;
  align-items: center;
  grid-gap: 1rem;
}

.capex-price{
  text-align: center;
}

.capex-label{
  border-radius: 10px;
  padding: 0.2rem 0 0.2rem 0;
  background-color: var(--gray-color);
}

.capex-savings-label{
  font-size: x-large;
  font-weight: bolder;
  color: var(--green-color);
}

.capex-saving-info-label{
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 1rem;
}

.divider{
  width: 100%;
  background-color: var(--gray-color);
  height: 2px;
}

.opex{
  margin-top: 1rem;
}

.opex>main{
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-column-gap: 2rem;
}

.opex-grid{
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-gap: 1rem;
  text-align: left;
}

#opex-grid-divider{
  grid-column: 1 / span 2;
}

.opex-info-promocode{
  font-weight: bold;
  color: var(--cat-color);
}

.opex-info-savings{
  text-align: center;
  font-size: xx-large;
  color: white;
}

@media (max-width: 1000px) {
  .content{
    flex-direction: column;
  }

  .data-side, .benefits-side{
    width: 100%;
  }
}

@media (max-width: 870px){
  .opex, .opex>main{
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .opex>main>aside{
    margin: 1rem 0 1rem 0;
  }
}

@media (max-width: 800px){
  .capex>main{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  .preliminary-savings{
    grid-column: 1 / span 2;
  }
}

@media (max-width: 630px){
  .form-grid-park{
    flex-wrap: wrap;
  }
  .p-floatlabel{
    min-width: 48%;
  }
}

@media(max-width: 592px){
  .form-grid-park{
    gap: 1rem;
  }
  .p-floatlabel{
    width: 100%;
  }
}

@media(max-width: 460px){
  .form-grid-equipment{
    display: flex;
    flex-direction: column;
  }
}

@media(max-width: 440px){
  .dscto-finz-grid{
    grid-template-columns: 50% 50%;
  }
  .promocode{
    grid-column: auto;
  }
  .dscto-finz-grid-singular-row, .promocode{
    grid-column-end: span 3;
  }
}

</style>
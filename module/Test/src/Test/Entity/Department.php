<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** 
 * @ORM\Entity
 */
class Department {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $code;
	
	/** @ORM\Column(type="string", length=255) */
	protected $name;
	
	/** @ORM\ManyToOne(targetEntity="User") */
	protected $manager;
	
	/** @ORM\ManyToOne(targetEntity="Store", inversedBy="departments")
	 *  @ORM\JoinColumn(name="store_id", referencedColumnName="id")
	 */
	protected $store;
	
	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }
    
    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }
    
    public function getStore(){
    	return $this->store;
    }
    
    public function setStore($store){
    	$this->store = $store;
    }
    
    public function getManager(){
    	return $this->manager;
    }
    
    public function setManager($manager){
    	$this->grants = $manager;
    }
    
    public function getFullname(){
    	$sto        = $this->getStore()?$this->getStore()->getName():'';
    	$fullname   = $sto?$sto.' - '.$this->getName():$this->getName();
    	return $fullname;
    }
}